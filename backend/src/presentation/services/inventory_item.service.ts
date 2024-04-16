import { Op } from "sequelize";
import { InventoryItem } from "../../database/mysql/models";
import { CustomError, CreateInventoryItemDTO, InventoryItemEntity, PaginationDto } from "../../domain";

export interface InventoryItemFilters {
    name: string;
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
        if (filters.name) where = { ...where, name: { [Op.like]: `%${filters.name}%` } };

        const [rows, total] = await Promise.all([
            InventoryItem.findAll({ where, offset: (page - 1) * limit, limit }),
            InventoryItem.count({ where })
        ]);
        const entities = rows.map(row => InventoryItemEntity.fromObject(row));
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
            await InventoryItem.create({ ...dto, last_check_by: id_user, last_check: new Date() });
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

}