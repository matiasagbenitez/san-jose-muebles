import { CustomError } from '../../errors/custom.error';

export class SupplierAccountEntity {
    constructor(
        public id: string,
        public id_supplier: string,
        // public supplier: string,
        public id_currency: string,
        public currency: string,
        public balance: number,
        public updated_at: Date,
    ) { }

    static fromObject(object: { [key: string]: any }): SupplierAccountEntity {
        const { id, id_supplier, supplier, id_currency, currency, balance, updatedAt } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!id_supplier) throw CustomError.badRequest('Falta el ID del proveedor');
        // if (!supplier) throw CustomError.badRequest('Falta el nombre del proveedor');
        if (!id_currency) throw CustomError.badRequest('Falta el ID de la moneda');
        if (!currency) throw CustomError.badRequest('Falta el nombre de la moneda');
        if (!balance) throw CustomError.badRequest('Falta el saldo');
        if (!updatedAt) throw CustomError.badRequest('Falta la fecha de creación');

        return new SupplierAccountEntity(
            id,
            id_supplier,
            // supplier,
            id_currency,
            currency.name + ' (' + currency.symbol + ')',
            balance,
            updatedAt
        );
    }
}