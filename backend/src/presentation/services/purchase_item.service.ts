import { PurchaseItem } from "../../database/mysql/models";
import { CustomError, UpdateItemStockDto } from "../../domain";
import { ProductService } from "./product.service";

export class PurchaseItemService {

    public async createItems(id_purchase: number, id_currency: number, items: any[]) {
        try {

            const productService = new ProductService();
            const itemsToCreate = items.map((item) => ({
                id_purchase,
                ...item,
                actual_stocked: 0,
                fully_stocked: false,
            }));

            // CREAMOS LOS ITEMS DE COMPRA
            const itemsCreated = await PurchaseItem.bulkCreate(itemsToCreate);

            // ACTUALIZAMOS EL INC_STOCK DE LOS PRODUCTOS, LA MONEDA Y EL PRECIO
            itemsCreated.forEach(async (item) => {
                await productService.updateProductByPurchase(item.id_product, id_currency, item.quantity, item.price);
            });

        } catch (error: any) {
            if (error.name === 'SequelizeValidationError') {
                throw CustomError.badRequest(`Ocurrió un error al crear los detalles de compra: ${error.errors[0].message}`);
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

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

    public async updateAllItemsStock(id_purchase: number) {
        try {
            const items = await PurchaseItem.findAll({ where: { id_purchase } });

            const productService = new ProductService();
            items.forEach(async (item) => {
                const received: number = Number(item.quantity) - Number(item.actual_stocked);
                await item.update({ actual_stocked: item.quantity, fully_stocked: true });
                await productService.updateStockByReception(item.id_product, received);
            });

        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async hasOneItemReceived(id_purchase: number): Promise<boolean> {
        try {
            const items = await PurchaseItem.findAll({ where: { id_purchase } });
            return items.some(item => item.actual_stocked > 0);
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async decreaseIncomingStockByCancellation(id_purchase: number) {
        try {
            const items = await PurchaseItem.findAll({ where: { id_purchase } });
            const productService = new ProductService();

            // Array para almacenar las actualizaciones que se realizarán
            const updates = items.map((item) => ({
                id_product: item.id_product,
                quantity: Number(item.quantity),
            }));

            // Actualizar el stock de cada producto en una sola operación
            await productService.decreaseIncomingStockInBulk(updates);
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async getPendingReceptionsByProductId(id_product: number): Promise<any> {
        try {
            const items = await PurchaseItem.findAll({
                where: { id_product, fully_stocked: false },
                include: [
                    {
                        association: 'purchase',
                        attributes: ['id', 'date', 'nullified'],
                        where: { nullified: false },
                        include: [
                            {
                                association: 'supplier',
                                attributes: ['id', 'name']
                            },
                        ]
                    }
                ]
            });

            return items;
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

}