import { Purchase, PurchaseItem } from "../../database/mysql/models";
import { CustomError, UpdateItemStockDto, ReceptionPartialDto, ReceptionTotalDto } from "../../domain";
import { ProductService } from "./product.service";
import { ReceptionPartialService } from "./reception_partial.service";
import { ReceptionTotalService } from "./reception_total.service.service";

export class PurchaseItemService {

    public async createItem(id_purchase: number, id_currency: number, item: any) {
        try {
            await PurchaseItem.create({
                id_purchase,
                ...item,
                actual_stocked: 0,
                fully_stocked: false,
            });
            const productService = new ProductService();
            await productService.updateProductByPurchase(item.id_product, id_currency, item.quantity, item.price);
        } catch (error: any) {
            if (error.name === 'SequelizeValidationError') {
                throw CustomError.badRequest(`Ocurrió un error al crear un detalle de compra: ${error.errors[0].message}`);
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async updateItemStock(updateItemDto: UpdateItemStockDto, id_user: number) {

        try {
            const { id_purchase, id_item, quantity_received } = updateItemDto;

            const item = await PurchaseItem.findOne({ where: { id: id_item, id_purchase } });
            if (!item) throw CustomError.notFound('No se encontró el ítem de la compra');

            const buyed = Number(item.quantity);
            const actual = Number(item.actual_stocked);
            const max_to_receive = buyed - actual;

            if (quantity_received <= 0) throw CustomError.badRequest('¡La cantidad recibida debe ser mayor a 0!');
            if (item.fully_stocked) throw CustomError.badRequest('¡El ítem ya está completamente stockeado!');
            if (quantity_received > max_to_receive) throw CustomError.badRequest(`¡La cantidad recibida no puede ser superior a ${max_to_receive}!`);

            // ACTUALIZAR STOCK DEL ITEM
            if (actual + quantity_received == buyed) {
                await item.update({ actual_stocked: buyed, fully_stocked: true });
            } else {
                await item.update({ actual_stocked: actual + quantity_received });
            }

            // ACTUALIZAR STOCK DEL PRODUCTO
            const productService = new ProductService();
            await productService.updateStockByReception(item.id_product, quantity_received);

            return item;

        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }

    }

    public async updateAllItemsStock(id_purchase: number, id_user: number) {
        try {
            const items = await PurchaseItem.findAll({ where: { id_purchase } });

            const productService = new ProductService();
            items.forEach(async (item) => {
                await item.update({ actual_stocked: item.quantity, fully_stocked: true });
                await productService.updateStockByReception(item.id_product, item.quantity);
            });

        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

}