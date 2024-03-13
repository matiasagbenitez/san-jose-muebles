import { Op } from "sequelize";
import { Purchase, PurchaseItem } from "../../database/mysql/models";
import { CustomError, NewPurchaseDto, PaginationDto } from "../../domain";

export interface PurchaseFilters {
    name: string;
    id_locality: number;
}
export class PurchaseService {

    // public async getPurchases() {
    //     const suppliers = await Purchase.findAll();
    //     const suppliersEntities = suppliers.map(supplier => PurchaseEntity.fromObject(supplier));
    //     return { items: suppliersEntities };
    // }


    // public async getPurchasesPaginated(paginationDto: PaginationDto, filters: PurchaseFilters) {
    //     const { page, limit } = paginationDto;

    //     // FILTERS
    //     let where = {};
    //     if (filters.name) where = { ...where, name: { [Op.like]: `%${filters.name}%` } };

    //     const [suppliers, total] = await Promise.all([
    //         Purchase.findAll({
    //             where,
    //             include: [{
    //                 association: 'locality',
    //                 include: [{
    //                     association: 'province',
    //                 }]
    //             }],
    //             offset: (page - 1) * limit,
    //             limit
    //         }),
    //         Purchase.count({ where })
    //     ]);
    //     const suppliersEntities = suppliers.map(supplier => PurchaseEntity.listablePurchase(supplier));
    //     return { items: suppliersEntities, total_items: total };
    // }

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