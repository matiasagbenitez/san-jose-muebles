import { CustomError } from '../../errors/custom.error';

export class SupplierAccountListEntity {
    constructor(
        public id: string,
        public supplier: {
            id: string,
            name: string,
        },
        public currency: {
            name: string,
            symbol: string,
            is_monetary: boolean,
        },
        public balance: number,
        public updatedAt?: Date
    ) { }

    static fromObject(object: { [key: string]: any }): SupplierAccountListEntity {
        const { id, supplier, currency, balance, updatedAt } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!supplier) throw CustomError.badRequest('Falta el proveedor');
        if (!currency) throw CustomError.badRequest('Falta la moneda');
        if (!balance) throw CustomError.badRequest('Falta el saldo');

        return new SupplierAccountListEntity(
            id,
            {
                id: supplier.id,
                name: supplier.name,
            },
            {
                name: currency.name,
                symbol: currency.symbol,
                is_monetary: currency.is_monetary,
            },
            balance,
            updatedAt
        );
    }
}