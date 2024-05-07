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
        public status: 'VALIDA' | 'ANULADA',
    ) { }

    static fromObject(object: { [key: string]: any }): ListablePurchaseEntity {
        const { id, date, supplier, currency, total, fully_stocked, nullation, createdAt } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!createdAt) throw CustomError.badRequest('Falta la fecha de creación');
        if (!date) throw CustomError.badRequest('Falta la fecha de la compra');
        if (!supplier.name) throw CustomError.badRequest('Falta el nombre del proveedor');
        if (!currency) throw CustomError.badRequest('Falta la moneda');
        if (!total) throw CustomError.badRequest('Falta el total');
        if (fully_stocked === undefined) throw CustomError.badRequest('Falta el estado de stock');

        return new ListablePurchaseEntity(
            id,
            createdAt,
            date,
            supplier.name,
            {
                symbol: currency.symbol,
                is_monetary: currency.is_monetary,
            },
            total,
            fully_stocked,
            nullation ? 'ANULADA' : 'VALIDA',
        );

    }
}