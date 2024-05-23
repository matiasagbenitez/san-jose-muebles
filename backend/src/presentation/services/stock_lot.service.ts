import { StockLot, StockAdjust, Product } from "../../database/mysql/models";
import { CustomError, PaginationDto, CreateStockLotDTO } from "../../domain";

interface StockAdjustInterface {
    id_product: number,
    id_stock_lot: number,
    prev_stock: number,
    quantity: number,
    post_stock: number,
}

export class StockLotService {

    public async createStockLot(dto: CreateStockLotDTO) {
        const transaction = await StockLot.sequelize!.transaction();
        if (!transaction) throw CustomError.internalServerError('No se pudo iniciar la transacción');

        try {
            const stock_lot = await StockLot.create({
                type: dto.type,
                description: dto.description,
                id_user: dto.id_user,
            }, { transaction, returning: true });
            if (!stock_lot) throw CustomError.internalServerError('No se pudo crear el ajuste de stock');

            const list = [];
            const isDecrement = dto.type === 'DECREMENT';

            for (const item of dto.stock_list) {
                // Verificar que el producto exista
                const product = await Product.findByPk(item.id_product, { attributes: ['id', 'actual_stock'], transaction });
                if (!product) throw CustomError.badRequest(`No existe el producto con ID ${item.id_product}`);

                const prev_stock = Number(product.actual_stock);
                const new_quantity = Number(item.quantity);
                const post_stock = isDecrement ? prev_stock - new_quantity : prev_stock + new_quantity;

                // Verificar que haya suficiente stock en caso de DECREMENT
                if (isDecrement && prev_stock < new_quantity) {
                    throw CustomError.badRequest(`No hay suficiente stock del producto con ID ${item.id_product}`);
                }

                // Actualizar el stock del producto
                product.actual_stock = post_stock;
                await product.save({ transaction });

                // Crear el registro de ajuste
                list.push({
                    id_stock_lot: stock_lot.id,
                    id_product: item.id_product,
                    prev_stock: prev_stock, 
                    quantity: new_quantity,
                    post_stock: post_stock,
                });
            }

            // Crear los registros de ajuste
            await StockAdjust.bulkCreate(list, { transaction });

            await transaction.commit();
            return { message: '¡Lote creado con éxito!' };
        } catch (error) {
            await transaction.rollback();
            throw CustomError.internalServerError(`${error}`);
        }
    }

}