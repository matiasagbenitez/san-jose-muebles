import { Op, Transaction } from "sequelize";
import { StockAdjust } from "../../database/mysql/models";
import { CustomError, PaginationDto, StockAdjustDto, StockAdjustEntity } from "../../domain";

export class StockAdjustService {

    public async createStockAdjust(createStockAdjustDto: StockAdjustDto, t: Transaction) {
        try {
            const adjustment = await StockAdjust.create({ ...createStockAdjustDto }, { transaction: t });
            return { adjustment };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async getStockAdjustsByProductId(id_product: number, paginationDto: PaginationDto, filters: any) {
        const { page, limit } = paginationDto;

        // FILTERS
        let where = {};
        where = { ...where, id_product };
        if (filters.name) where = { ...where, name: { [Op.like]: `%${filters.name}%` } };

        const [rows, total] = await Promise.all([
            StockAdjust.findAll({
                where,
                include: [{
                    association: 'user',
                    attributes: ['name']
                }],
                offset: (page - 1) * limit,
                limit,
                order: [['updatedAt', 'DESC']]
            }),
            StockAdjust.count({ where })
        ]);
        const entities = rows.map(row => StockAdjustEntity.fromObject(row));
        return { items: entities, total_items: total };

    }
}