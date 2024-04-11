import { CustomError } from '../../errors/custom.error';

export class SupplierAccountDataEntity {
    constructor(
        public id: string,
        public supplier: string,
        public currency: string,
        public symbol: string,
        public is_monetary: boolean,
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
            supplier.name,
            currency.name + ' (' + currency.symbol + ')',
            currency.symbol,
            currency.is_monetary,
            balance
        );
    }
}