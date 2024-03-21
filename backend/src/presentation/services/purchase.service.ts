import { Product, Purchase, PurchaseItem, User } from "../../database/mysql/models";
import { CustomError, NewPurchaseDto, PaginationDto, ListablePurchaseEntity, DetailPurchaseEntity, UpdateItemStockDto, ReceptionPartialDto, ReceptionTotalDto } from "../../domain";
import { ProductService } from "./product.service";
import { PurchaseItemService } from "./purchase_item.service";
import { ReceptionPartialService } from "./reception_partial.service";
import { ReceptionTotalService } from "./reception_total.service.service";

export interface PurchaseFilters {
    name: string;
    id_locality: number;
}
export class PurchaseService {

    public async getPurchases() {
        const purchases = await Purchase.findAll({ include: ['supplier', 'currency'] });
        const listable = purchases.map(item => ListablePurchaseEntity.fromObject(item));
        return { items: listable };
    }


    public async getPurchasesPaginated(paginationDto: PaginationDto, filters: PurchaseFilters) {
        const { page, limit } = paginationDto;

        // FILTERS
        let where = {};
        // if (filters.name) where = { ...where, name: { [Op.like]: `%${filters.name}%` } };

        const [purchases, total] = await Promise.all([
            Purchase.findAll({
                where,
                include: ['supplier', 'currency'],
                offset: (page - 1) * limit,
                limit,
                order: [['date', 'DESC'], ['createdAt', 'DESC']],
            }),
            Purchase.count({ where }),
        ]);
        const listable = purchases.map(item => ListablePurchaseEntity.fromObject(item));
        return { items: listable, total_items: total };
    }

    public async getPurchase(id: number) {
        const purchase = await Purchase.findByPk(id, {
            attributes: {
                exclude: ['id_supplier', 'id_currency', 'created_by', 'nullified_by'],
            },
            include: [{
                association: 'items',
                attributes: ['id', 'quantity', 'price', 'subtotal', 'actual_stocked', 'fully_stocked'],
                include: [{
                    association: 'product',
                    attributes: ['code', 'name'],
                    include: [{
                        association: 'brand',
                        attributes: ['name']
                    }, {
                        association: 'unit',
                        attributes: ['name', 'symbol']
                    }]
                },]
            }, {
                association: 'currency',
                attributes: ['name', 'symbol', 'is_monetary']
            }, {
                association: 'supplier',
                attributes: ['id', 'name'],
                include: [{
                    association: 'locality',
                    attributes: ['name'],
                    include: [{
                        association: 'province',
                        attributes: ['name']
                    }]
                }]
            }, {
                association: 'creator',
                attributes: ['name']
            }, {
                association: 'nullifier',
                attributes: ['name']
            }],

        });

        if (!purchase) throw CustomError.notFound('Compra no encontrada');
        const { ...entity } = DetailPurchaseEntity.fromObject(purchase);
        return { purchase: entity };
    }

    public async createPurchase(form: NewPurchaseDto, id_user: number) {

        try {
            const { products_list, ...rest } = form;

            const purchase = await Purchase.create({
                ...rest,
                created_by: id_user,
                nullified_by: id_user,
            });

            const purchaseItemService = new PurchaseItemService();
            products_list.forEach(async (item) => {
                await purchaseItemService.createItem(purchase.id, purchase.id_currency, item);
            });

            return { id: purchase.id, message: '¡La compra se creó correctamente!' };

        } catch (error: any) {
            if (error.name === 'SequelizeValidationError') {
                throw CustomError.badRequest(`Ocurrió un error al crear la compra: ${error.errors[0].message}`);
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async checkFullyStocked(id_purchase: number): Promise<boolean> {
        try {
            const purchase = await Purchase.findByPk(id_purchase, { include: ['items'] });
            if (!purchase || !purchase.items) throw CustomError.notFound('No se encontraron ítems de la compra');

            const fully_stocked = purchase.items.every(item => item.fully_stocked);
            if (fully_stocked) {
                await purchase.update({ fully_stocked: true });
                return true;
            }

            return false;
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async updateReceivedStock(updateItemDto: UpdateItemStockDto, id_user: number) {

        try {
            const purchaseItemService = new PurchaseItemService();
            const item = await purchaseItemService.updateItemStock(updateItemDto, id_user);
            const fully_stocked = await this.checkFullyStocked(updateItemDto.id_purchase);
            
            // REGISTRAR EL USUARIO QUE REGISTRÓ LA RECEPCIÓN
            const { quantity_received } = updateItemDto;
            const [detailError, detailDto] = ReceptionPartialDto.create({ id_purchase_item: item.id, id_user, quantity_received });
            if (detailError) throw CustomError.badRequest(detailError);
            const detailService = new ReceptionPartialService();
            if (detailDto) await detailService.createReceptionPartial(detailDto);

            return {
                fully_stocked,
                item: {
                    id: item.id,
                    quantity: Number(item.quantity),
                    actual_stocked: item.actual_stocked,
                    fully_stocked: item.fully_stocked,
                },
                message: '¡Stock actualizado correctamente!'
            };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }

    }

    public async setPurchaseFullyStocked(id_purchase: number, id_user: number) {
        try {
            const purchase = await Purchase.findByPk(id_purchase);
            if (!purchase) throw CustomError.notFound('Compra no encontrada');
            const purchaseItemService = new PurchaseItemService();
            await purchaseItemService.updateAllItemsStock(id_purchase, id_user);
            await purchase.update({ fully_stocked: true });

            // REGISTRAR EL USUARIO QUE REGISTRÓ LA RECEPCIÓN
            const [detailError, detailDto] = ReceptionTotalDto.create({ id_purchase, id_user });
            if (detailError) throw CustomError.badRequest(detailError);
            const detailService = new ReceptionTotalService();
            if (detailDto) await detailService.createReceptionTotal(detailDto);

            return { message: '¡Stock de la compra actualizado correctamente!' };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }




    public async nullifyPurchase(id: number, reason: string, id_user: number) {
        const PurchaseDetailInterface = await Purchase.findByPk(id);
        if (!PurchaseDetailInterface) throw CustomError.notFound('Compra no encontrada');

        try {
            const user = await User.findByPk(id_user);
            if (!user) throw CustomError.notFound('Usuario no encontrado');

            const now = Date.now();

            await PurchaseDetailInterface.update({
                nullified: true, nullified_by: user.id, nullified_reason: reason, nullified_date: now
            })

            const nullifiedData = {
                nullifier: user.name,
                nullified_reason: reason,
                nullified_date: now
            }

            return { nullifiedData, message: 'Compra anulada correctamente. Se reestableció el stock de los productos incluidos.' };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

}