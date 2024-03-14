import { Op } from "sequelize";
import { Purchase, PurchaseItem } from "../../database/mysql/models";
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

    // public async deletePurchase(id: number) {
    //     const supplier = await Purchase.findByPk(id);
    //     if (!supplier) throw CustomError.notFound('Proveedor no encontrado');

    //     try {
    //         await supplier.destroy();
    //         return { message: 'Proveedor eliminado correctamente' };
    //     } catch (error) {
    //         throw CustomError.internalServerError(`${error}`);
    //     }
    // }

}