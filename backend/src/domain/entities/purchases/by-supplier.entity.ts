import { CustomError } from '../../errors/custom.error';

export class PurchasesBySupplierEntity {
    constructor(
        public id: number,
        public created_at: string,
        public user: string,
        public date: Date,
        public currency: string,
        public symbol: string,
        public total: string,
        public fully_stocked: boolean,
        public nullified: boolean,
    ) { }

    static fromObject(object: { [key: string]: any }): PurchasesBySupplierEntity {
        const { id, date, supplier, currency, total, fully_stocked, nullified, createdAt, creator } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!date) throw CustomError.badRequest('Falta la fecha de la compra');
        if (!supplier.name) throw CustomError.badRequest('Falta el nombre del proveedor');
        if (!currency.symbol) throw CustomError.badRequest('Falta el símbolo de la moneda');
        if (currency.is_monetary === undefined) throw CustomError.badRequest('Falta el estado de moneda');
        if (!total) throw CustomError.badRequest('Falta el total');
        if (fully_stocked === undefined) throw CustomError.badRequest('Falta el estado de stock');
        if (nullified === undefined) throw CustomError.badRequest('Falta el estado de anulación');
        if (!createdAt) throw CustomError.badRequest('Falta la fecha de creación');
        if (!creator) throw CustomError.badRequest('Falta el usuario');

        return new PurchasesBySupplierEntity(
            id,
            createdAt,
            creator.name,
            date,
            currency.name + ' ' + (currency.symbol),
            currency.symbol,
            total,
            fully_stocked,
            nullified
        );

    }
}