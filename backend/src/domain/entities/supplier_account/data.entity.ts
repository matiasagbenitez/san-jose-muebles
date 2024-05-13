import { CustomError } from '../../errors/custom.error';

export class SupplierAccountDataEntity {
    constructor(
        public id: string,
        public supplier: {
            name: string,
            locality: string,
        },
        public currency: {
            name: string,
            symbol: string,
            is_monetary: boolean,
        },
        public balance: number,
    ) { }

    static fromObject(object: { [key: string]: any }): SupplierAccountDataEntity {
        const { id, supplier, currency, balance } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!supplier) throw CustomError.badRequest('Falta el proveedor');
        if (!currency) throw CustomError.badRequest('Falta la moneda');
        if (!balance) throw CustomError.badRequest('Falta el saldo');

        return new SupplierAccountDataEntity(
            id,
            {
                name: supplier.name,
                locality: supplier.locality.name + ', ' + supplier.locality.province.name,
            },
            {
                name: currency.name,
                symbol: currency.symbol,
                is_monetary: currency.is_monetary,
            },
            balance
        );
    }
}