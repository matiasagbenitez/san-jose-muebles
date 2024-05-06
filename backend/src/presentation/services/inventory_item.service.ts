import { Op } from "sequelize";
import { InventoryBrand, InventoryCategory, InventoryItem, InventoryItemEvolution } from "../../database/mysql/models";
import {
    CustomError, PaginationDto,
    CreateInventoryItemDTO, UpdateInventoryItemDTO, UpdateInventoryItemStatusDTO,
    ListableInventoryItemEntity, InventoryItemEntity
} from "../../domain";

export interface InventoryItemFilters {
    text?: string;
    id_inventory_brand?: string;
    id_inventory_categ?: string;
    status?: 'RESERVADO' | 'OPERATIVO' | 'RETIRADO' | 'DESCARTADO' | 'ALL';
}

export class InventoryItemService {

    public async getInventoryItems() {
        const rows = await InventoryItem.findAll({
            include: [
                { association: 'category', attributes: ['name'] },
                { association: 'brand', attributes: ['name'] },
            ],
        });
        const entities = rows.map(row => ListableInventoryItemEntity.fromObject(row));
        return { items: entities };
    }

    public async getInventoryItemsPaginated(paginationDto: PaginationDto, filters: InventoryItemFilters) {
        const { page, limit } = paginationDto;

        // FILTERS
        let where = {};
        if (filters.text) where = {
            [Op.or]: [
                { name: { [Op.like]: `%${filters.text}%` } },
                { code: { [Op.like]: `%${filters.text}%` } },
            ]
        };
        if (filters.id_inventory_brand) where = { ...where, id_inventory_brand: filters.id_inventory_brand };
        if (filters.id_inventory_categ) where = { ...where, id_inventory_categ: filters.id_inventory_categ };
        switch (filters.status) {
            case 'OPERATIVO':
                where = { ...where, status: 'OPERATIVO' };
                break;
            case 'RESERVADO':
                where = { ...where, status: 'RESERVADO' };
                break;
            case 'RETIRADO':
                where = { ...where, status: 'RETIRADO' };
                break;
            case 'DESCARTADO':
                where = { ...where, status: 'DESCARTADO' };
                break;
            case 'ALL':
                break;
            default:
                where = { ...where, status: 'OPERATIVO' };
                break;
        }

        const [rows, total] = await Promise.all([
            InventoryItem.findAll({
                where,
                include: [
                    { association: 'category', attributes: ['name'] },
                    { association: 'brand', attributes: ['name'] },
                ],
                offset: (page - 1) * limit,
                limit
            }),
            InventoryItem.count({ where })
        ]);
        const entities = rows.map(row => ListableInventoryItemEntity.fromObject(row));
        return { items: entities, total_items: total };
    }

    public async getInventoryItem(id: number) {
        const row = await InventoryItem.findByPk(id, {
            include: [
                { association: 'category' },
                { association: 'brand' },
                { association: 'evolutions', include: [{ association: 'user', attributes: ['name'] }] },
            ],
            order: [
                ['evolutions', 'createdAt', 'DESC'],
            ]
        });

        if (!row) throw CustomError.notFound('Ítem no encontrado');
        const { ...rowEntity } = InventoryItemEntity.fromObject(row);
        return { item: rowEntity };
    }

    public async createInventoryItem(dto: CreateInventoryItemDTO, id_user: number) {
        try {
            const [brand, category] = await Promise.all([
                InventoryBrand.findByPk(dto.id_inventory_brand),
                InventoryCategory.findByPk(dto.id_inventory_categ),
            ]);
            if (!brand) throw CustomError.notFound('Marca no encontrada');
            if (!category) throw CustomError.notFound('Categoría no encontrada');

            const code = await this.createCode(dto.id_inventory_brand, dto.id_inventory_categ);

            await InventoryItem.create({ ...dto, code });
            return { message: '¡Ítem creado correctamente!' };
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw CustomError.badRequest('¡El ítem que intenta crear ya existe!');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async createCode(id_inventory_brand: number, id_inventory_categ: number): Promise<string> {
        const formatNumber = (num: number) => (num < 10 ? '0' + num : num.toString());

        const codeBrand = formatNumber(id_inventory_brand);
        const codeCategory = formatNumber(id_inventory_categ);

        const lastItem = await InventoryItem.findOne({
            where: {
                id_inventory_brand,
                id_inventory_categ,
            },
            order: [['id', 'DESC']],
        });

        let code: string;
        if (lastItem) {
            const lastCodeNumber = parseInt(lastItem.code.slice(-3));
            const newCodeNumber = (lastCodeNumber + 1).toString().padStart(3, '0');
            code = codeCategory + '-' + codeBrand + '-' + newCodeNumber;
        } else {
            code = codeCategory + '-' + codeBrand + '-' + '001';
        }

        return code;
    }


    public async updateInventoryItem(id: number, dto: UpdateInventoryItemDTO) {
        const item = await InventoryItem.findByPk(id);
        if (!item) throw CustomError.notFound('Ítem no encontrado');

        try {
            await item.update({ ...dto });
            return { message: '¡Ítem actualizado correctamente!' };
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw CustomError.badRequest('¡El ítem que intenta actualizar ya existe!');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async deleteInventoryItem(id: number) {
        const item = await InventoryItem.findByPk(id);
        if (!item) throw CustomError.notFound('Ítem no encontrado');

        try {
            await item.destroy();
            return { message: '¡Ítem eliminado correctamente!' };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async updateInventoryItemStatus(id: number, dto: UpdateInventoryItemStatusDTO, id_user: number) {
        const item = await InventoryItem.findByPk(id);
        if (!item) throw CustomError.notFound('Ítem no encontrado');

        const transaction = await InventoryItem.sequelize!.transaction();
        try {
            await item.update({ status: dto.status }, { transaction });
            await InventoryItemEvolution.create({
                id_inventory_item: id,
                ...dto,
                id_user
            }, { transaction });
            await transaction.commit();
            return { message: '¡Estado del ítem actualizado correctamente!' };
        } catch (error: any) {
            await transaction.rollback();
            throw CustomError.internalServerError(`${error}`);
        }
    }

}