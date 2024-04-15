import { StockAdjust } from "../../database/mysql/models";
import { CustomError, StockAdjustDto } from "../../domain";

export class StockAdjustService {

    public async createStockAdjust(createStockAdjustDto: StockAdjustDto) {
        try {
            const adjustment = await StockAdjust.create({ ...createStockAdjustDto });
            return { adjustment };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async getStockAdjustsByProductId(id_product: number) {
        const adjustments = await StockAdjust.findAll({ where: { id_product }, order: [['createdAt', 'DESC']] });
        return { adjustments };
    }
}