import { CustomError } from '../../../errors/custom.error';

interface CurrencyInterface {
    id: number;
    name: string;
    symbol: string;
    is_monetary: boolean;
}

interface EntityInterface {
    id: number;
    name: string;
    locality: string;
}

export class EntityTransactionDetailEntity {
    constructor(
        public id: string,
        public id_account: string,

        // ENTITY
        public entity: EntityInterface,
        public currency: CurrencyInterface,

        // TRANSACTION
        public type: 'PAYMENT' | 'DEBT' | 'POS_ADJ' | 'NEG_ADJ',
        public description: string,

        // BALANCE
        public prev_balance: number,
        public amount: number,
        public post_balance: number,

        // AUDIT
        public user: string,
        public createdAt: Date,

    ) { }

    static fromObject(object: { [key: string]: any }): EntityTransactionDetailEntity {
        const {
            id,
            id_entity_account,
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
        if (!id_entity_account) throw CustomError.badRequest('Falta el ID de la cuenta');
        if (!account) throw CustomError.badRequest('Falta la cuenta');
        if (!account.entity) throw CustomError.badRequest('Falta la entidad');
        if (!account.currency) throw CustomError.badRequest('Falta la moneda');
        if (!type) throw CustomError.badRequest('Falta el tipo');
        if (!prev_balance) throw CustomError.badRequest('Falta el saldo anterior');
        if (!amount) throw CustomError.badRequest('Falta el monto');
        if (!post_balance) throw CustomError.badRequest('Falta el saldo posterior');

        if (!user) throw CustomError.badRequest('Falta el usuario');
        if (!createdAt) throw CustomError.badRequest('Falta la fecha de creación');

        const currencyData: CurrencyInterface = {
            id: account.currency.id,
            name: account.currency.name,
            symbol: account.currency.symbol,
            is_monetary: account.currency.is_monetary,
        };

        const entityData: EntityInterface = {
            id: account.entity.id,
            name: account.entity.name,
            locality: account.entity.locality.name + ' - ' + account.entity.locality.province.name,
        };

        return new EntityTransactionDetailEntity(
            id,
            id_entity_account,
            entityData,
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