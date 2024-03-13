import { Op } from "sequelize";
import { Purchase, PurchaseItem } from "../../database/mysql/models";
import { CustomError, NewPurchaseDto, PaginationDto, ListablePurchaseEntity } from "../../domain";

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

    // public async getPurchase(id: number) {
    //     const supplier = await Purchase.findByPk(id, {
    //         include: [{
    //             association: 'locality',
    //             include: [{
    //                 association: 'province',
    //             }]
    //         }]
    //     });
    //     if (!supplier) throw CustomError.notFound('Proveedor no encontrado');
    //     const { ...supplierEntity } = PurchaseEntity.fromObject(supplier);
    //     return { supplier: supplierEntity };
    // }

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