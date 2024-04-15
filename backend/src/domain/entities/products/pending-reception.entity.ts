import { CustomError } from '../../errors/custom.error';

export class ProductPendingReceptionEntity {
    constructor(
        public id: number,
        public date: Date,
        public supplier: string,
        public id_purchase: number,
        public pending_stock: number,
    ) { }

    static fromObject(object: { [key: string]: any }): ProductPendingReceptionEntity {
        const { id, purchase, quantity, actual_stocked } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!purchase) throw CustomError.badRequest('Falta la compra');
        if (!quantity) throw CustomError.badRequest('Falta la cantidad');
        if (!actual_stocked) throw CustomError.badRequest('Falta la cantidad recibida');


        return new ProductPendingReceptionEntity(
            id,
            purchase.date,
            purchase.supplier.name || 'Proveedor no identificado',
            purchase.id,
            quantity - actual_stocked,
        );

    }
}