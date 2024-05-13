import { CustomError } from '../../errors/custom.error';

interface CurrencyInterface {
    name: string;
    symbol: string;
    is_monetary: boolean;
}

interface SupplierInterface {
    name: string;
    locality: string;
}

export class SupplierTransactionDetailEntity {
    constructor(
        public id: string,
        public id_account: string,

        // SUPPLIER
        public supplier: SupplierInterface,
        public currency: CurrencyInterface,

        // TRANSACTION
        public type: 'NEW_PAYMENT' | 'POS_ADJ' | 'NEG_ADJ' | 'NEW_CLIENT_PAYMENT' | 'DEL_CLIENT_PAYMENT',
        public description: string,

        // BALANCE
        public prev_balance: number,
        public amount: number,
        public post_balance: number,

        // AUDIT
        public user: string,
        public createdAt: Date,

    ) { }

    static fromObject(object: { [key: string]: any }): SupplierTransactionDetailEntity {
        const {
            id,
            id_supplier_account,
            account,
            type,
            description,
            prev_balance,
            amount,
            post_balance,
            user,
            createdAt,
        } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!id_supplier_account) throw CustomError.badRequest('Falta el ID de la cuenta');
        if (!account) throw CustomError.badRequest('Falta la cuenta');
        if (!account.supplier) throw CustomError.badRequest('Falta el proveedor');
        if (!account.currency) throw CustomError.badRequest('Falta la moneda');
        if (!type) throw CustomError.badRequest('Falta el tipo');
        if (!prev_balance) throw CustomError.badRequest('Falta el saldo anterior');
        if (!amount) throw CustomError.badRequest('Falta el monto');
        if (!post_balance) throw CustomError.badRequest('Falta el saldo posterior');

        if (!user) throw CustomError.badRequest('Falta el usuario');
        if (!createdAt) throw CustomError.badRequest('Falta la fecha de creación');

        const currencyData: CurrencyInterface = {
            name: account.currency.name,
            symbol: account.currency.symbol,
            is_monetary: account.currency.is_monetary,
        };

        const supplierData: SupplierInterface = {
            name: account.supplier.name,
            locality: account.supplier.locality.name + ' - ' + account.supplier.locality.province.name,
        };

        return new SupplierTransactionDetailEntity(
            id,
            id_supplier_account,
            supplierData,
            currencyData,
            type,
            description,
            prev_balance,
            amount,
            post_balance,
            user.name,
            createdAt,
        );
    }
}