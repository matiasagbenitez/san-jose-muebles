import { Op } from "sequelize";
import { InventoryItem } from "../../database/mysql/models";
import { CustomError, CreateInventoryItemDTO, RetireInventoryItemDTO, InventoryItemEntity, PaginationDto, ListableInventoryItemEntity, UpdateInventoryItemDTO } from "../../domain";
import { InventoryItemRetiredService } from "./inventory_item_retired.service";
import { InventoryItemUpdatedService } from "./inventory_item_updated.service";

export interface InventoryItemFilters {
    text: string;
    id_inventory_brand: number;
    id_inventory_categ: number;
    is_retired: string;
}
export class InventoryItemService {

    public async getInventoryItems() {
        const rows = await InventoryItem.findAll();
        const entities = rows.map(row => InventoryItemEntity.fromObject(row));
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
        if (filters.is_retired === 'true') {
            where = { ...where, is_retired: true };
        } else if (filters.is_retired === 'false') {
            where = { ...where, is_retired: false };
        }

        const [rows, total] = await Promise.all([
            InventoryItem.findAll({
                where,
                include: [{
                    association: 'category',
                    attributes: ['name']
                }, {
                    association: 'brand',
                    attributes: ['name']
                }, {
                    association: 'user_check',
                    attributes: ['name']
                }],
                offset: (page - 1) * limit,
                limit
            }),
            InventoryItem.count({ where })
        ]);
        const entities = rows.map(row => ListableInventoryItemEntity.fromObject(row));
        return { items: entities, total_items: total };
    }

    public async getInventoryItem(id: number) {
        const row = await InventoryItem.findByPk(id);
        if (!row) throw CustomError.notFound('Ítem no encontrado');
        const { ...rowEntity } = InventoryItemEntity.fromObject(row);
        return { item: rowEntity };
    }

    public async createInventoryItem(dto: CreateInventoryItemDTO, id_user: number) {
        try {
            await InventoryItem.create({ ...dto, code: Date.now(), last_check_by: id_user });
            return { message: 'Ítem creado correctamente' };
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw CustomError.badRequest('El ítem que intenta crear ya existe');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async updateInventoryItem(id: number, dto: CreateInventoryItemDTO) {
        const item = await InventoryItem.findByPk(id);
        if (!item) throw CustomError.notFound('Ítem no encontrado');

        try {
            await item.update({ ...dto });
            return { message: 'Ítem actualizado correctamente' };
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw CustomError.badRequest('El ítem que intenta actualizar ya existe');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async deleteInventoryItem(id: number) {
        const item = await InventoryItem.findByPk(id);
        if (!item) throw CustomError.notFound('Ítem no encontrado');

        try {
            await item.destroy();
            return { message: 'Ítem eliminado correctamente' };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async validateInventoryItem(id: number, id_user: number) {
        const item = await InventoryItem.findByPk(id);
        if (!item) throw CustomError.notFound('Ítem no encontrado');

        try {
            await item.update({
                is_retired: false,
                last_check_by: id_user,
                last_check_at: new Date()
            });
            return { message: 'Ítem validado correctamente' };
        } catch (error: any) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async retireInventoryItem(retirementDto: RetireInventoryItemDTO) {
        const { id_inventory_item: id } = retirementDto;

        const item = await InventoryItem.findByPk(id);
        if (!item) throw CustomError.notFound('Ítem no encontrado');

        const t = await InventoryItem.sequelize!.transaction();
        try {
            await InventoryItem.update({
                is_retired: true,
            }, {
                where: { id },
                transaction: t
            });
            const retirementService = new InventoryItemRetiredService();
            await retirementService.createRetirementRecord(retirementDto!, t);

            await t.commit();

            return { message: 'Ítem retirado correctamente' };
        } catch (error: any) {

            await t.rollback();
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async updateQuantityInventoryItem(updatementDto: UpdateInventoryItemDTO) {
        const { id_inventory_item: id } = updatementDto;

        const item = await InventoryItem.findByPk(id);
        if (!item) throw CustomError.notFound('Ítem no encontrado');

        const t = await InventoryItem.sequelize!.transaction();
        try {
            await InventoryItem.update({
                quantity: updatementDto.new_quantity,
            }, {
                where: { id },
                transaction: t
            });
            const updatementService = new InventoryItemUpdatedService();
            await updatementService.createRetirementRecord(updatementDto!, t);

            await t.commit();

            return { message: 'Ítem actualizado correctamente' };
        } catch (error: any) {

            await t.rollback();
            throw CustomError.internalServerError(`${error}`);
        }
    }

}