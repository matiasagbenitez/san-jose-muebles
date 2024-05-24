import { StockAdjust } from "../../database/mysql/models";
import { CustomError, PaginationDto, StockAdjustEntity } from "../../domain";

export class StockAdjustService {

    public async getStockAdjustsByProductId(id_product: number, paginationDto: PaginationDto, filters: any) {
        const { page, limit } = paginationDto;

        const [rows, total] = await Promise.all([
            StockAdjust.findAll({
                where: {
                    id_product,
                },
                include: { association: 'lot', attributes: ['id'] },
                offset: (page - 1) * limit,
                limit,
                order: [['updatedAt', 'DESC']]
            }),
            StockAdjust.count({
                where: {
                    id_product,
                }
            })
        ]);
        const entities = rows.map(row => StockAdjustEntity.fromObject(row));

        return { items: entities, total_items: total };
    }
}