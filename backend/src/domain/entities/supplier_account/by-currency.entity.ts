import { CustomError } from '../../errors/custom.error';

export class SupplierAccountByCurrencyEntity {
    constructor(
        public id: string,
        public supplier: string,
        public currency: string,
        public balance: number,
    ) { }

    static fromObject(object: { [key: string]: any }): SupplierAccountByCurrencyEntity {
        const { id, supplier, currency, balance } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!supplier) throw CustomError.badRequest('Falta el proveedor');
        if (!currency) throw CustomError.badRequest('Falta la moneda');
        if (!balance) throw CustomError.badRequest('Falta el saldo');

        return new SupplierAccountByCurrencyEntity(
            id,
            supplier.name,
            currency.symbol,
            balance
        );
    }
}