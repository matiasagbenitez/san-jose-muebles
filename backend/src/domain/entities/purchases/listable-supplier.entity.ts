import { CustomError } from '../../errors/custom.error';

export class ListableSupplierPurchaseEntity {
    constructor(
        public id: number,
        public created_at: string,
        public user: string,
        public date: Date,
        public currency: {
            symbol: string,
            is_monetary: boolean,
        },
        public total: string,
        public fully_stocked: boolean,
        public status: 'VALIDA' | 'ANULADA',
    ) { }

    static fromObject(object: { [key: string]: any }): ListableSupplierPurchaseEntity {
        const { id, date, currency, total, fully_stocked, nullation, user, createdAt } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!user) throw CustomError.badRequest('Falta el usuario');
        if (!createdAt) throw CustomError.badRequest('Falta la fecha de creación');
        if (!date) throw CustomError.badRequest('Falta la fecha de la compra');
        if (!currency) throw CustomError.badRequest('Falta la moneda');
        if (!total) throw CustomError.badRequest('Falta el total');
        if (fully_stocked === undefined) throw CustomError.badRequest('Falta el estado de stock');

        return new ListableSupplierPurchaseEntity(
            id,
            createdAt,
            user.name,
            date,
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