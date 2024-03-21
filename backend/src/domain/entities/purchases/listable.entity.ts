import { CustomError } from '../../errors/custom.error';

export class ListablePurchaseEntity {
    constructor(
        public id: number,
        public created_at: string,
        public date: Date,
        public supplier: string,
        public currency: {
            symbol: string,
            is_monetary: boolean,
        },
        public total: string,
        public fully_stocked: boolean,
        public nullified: boolean,
    ) { }

    static fromObject(object: { [key: string]: any }): ListablePurchaseEntity {
        const { id, date, supplier, currency, total, fully_stocked, nullified, createdAt } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!date) throw CustomError.badRequest('Falta la fecha de la compra');
        if (!supplier.name) throw CustomError.badRequest('Falta el nombre del proveedor');
        if (!currency.symbol) throw CustomError.badRequest('Falta el símbolo de la moneda');
        if (currency.is_monetary === undefined) throw CustomError.badRequest('Falta el estado de moneda');
        if (!total) throw CustomError.badRequest('Falta el total');
        if (fully_stocked === undefined) throw CustomError.badRequest('Falta el estado de stock');
        if (nullified === undefined) throw CustomError.badRequest('Falta el estado de anulación');
        if (!createdAt) throw CustomError.badRequest('Falta la fecha de creación');

        const currencyObject = {
            symbol: currency.symbol,
            is_monetary: currency.is_monetary,
        };

        return new ListablePurchaseEntity(
            id,
            createdAt,
            date,
            supplier.name,
            currencyObject,
            total,
            fully_stocked,
            nullified,
        );

    }
}