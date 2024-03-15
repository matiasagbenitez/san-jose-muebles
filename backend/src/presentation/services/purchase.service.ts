import { Op } from "sequelize";
import { Purchase, PurchaseItem, User } from "../../database/mysql/models";
import { CustomError, NewPurchaseDto, PaginationDto, ListablePurchaseEntity, DetailPurchaseEntity } from "../../domain";

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
                order: [['payed_off', 'ASC'], ['fully_stocked', 'ASC'], ['date', 'DESC'], ['createdAt', 'DESC']],
            }),
            Purchase.count({ where })
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

            products_list.forEach(async (item) => {
                await PurchaseItem.create({
                    id_purchase: purchase.id,
                    ...item,
                    actual_stocked: 0,
                    fully_stocked: false,
                });
            });

            return { message: '¡La compra se creó correctamente!' };

        } catch (error: any) {
            if (error.name === 'SequelizeValidationError') {
                throw CustomError.badRequest(`Ocurrió un error al crear la compra: ${error.errors[0].message}`);
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async updatePurchaseItemStock(id_purchase: number, id_item: number, quantity_received: number) {

        try {
            const item = await PurchaseItem.findOne({ where: { id: id_item, id_purchase } });
            if (!item) throw CustomError.notFound('No se encontró el ítem de la compra');

            const buyed_quantity = Number(item.quantity);
            const actual_stocked = Number(item.actual_stocked);
            const received = Number(quantity_received);

            if (received <= 0) throw CustomError.badRequest('¡La cantidad recibida debe ser mayor a 0!');
            if (item.fully_stocked) throw CustomError.badRequest('¡El ítem ya está completamente stockeado!');

            if (actual_stocked + received >= buyed_quantity) {
                item.actual_stocked = buyed_quantity;
                item.fully_stocked = true;
            } else {
                item.actual_stocked = actual_stocked + received;
            }

            const item_updated = await item.save();

            const is_fully_stocked = await this.checkPurchaseFullyStocked(id_purchase);
            return {
                fully_stocked: is_fully_stocked,
                item: {
                    id: item_updated.id,
                    quantity: Number(item_updated.quantity),
                    actual_stocked: item_updated.actual_stocked,
                    pending: item_updated.quantity - item_updated.actual_stocked,
                    fully_stocked: item_updated.fully_stocked,
                }, message: '¡Stock actualizado correctamente!'
            };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }

    }

    public async updatePurchaseFullyStocked(id_purchase: number) {
        try {
            const items = await PurchaseItem.findAll({ where: { id_purchase } });
            items.forEach(async (item) => {
                item.actual_stocked = item.quantity;
                item.fully_stocked = true;
                await item.save();
            });
            const purchase = await Purchase.findByPk(id_purchase);
            if (purchase) {
                purchase.fully_stocked = true;
                await purchase.save();

            }
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async checkPurchaseFullyStocked(id_purchase: number): Promise<boolean> {
        try {
            const items = await PurchaseItem.findAll({ where: { id_purchase } });
            const fully_stocked = items.every(item => item.fully_stocked);
            if (fully_stocked) {
                const purchase = await Purchase.findByPk(id_purchase);
                if (purchase) {
                    purchase.fully_stocked = true;
                    await purchase.save();
                    return true;
                }
            }
            return false;
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