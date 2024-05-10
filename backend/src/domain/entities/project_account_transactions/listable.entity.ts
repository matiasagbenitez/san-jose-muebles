import { CustomError } from '../../errors/custom.error';

export class ProjectAccountTransactionEntity {
    constructor(
        public id: string,
        public createdAt: Date,
        public user: string,
        public type: 'NEW_PAYMENT' | 'POS_ADJ' | 'NEG_ADJ' | 'NEW_SUPPLIER_PAYMENT' | 'DEL_SUPPLIER_PAYMENT',
        public description: string,
        public received_amount: number,
        public currency: string,
        public is_monetary: boolean,
        public prev_balance: number,
        public equivalent_amount: number,
        public post_balance: number,
    ) { }

    static fromObject(object: { [key: string]: any }): ProjectAccountTransactionEntity {
        const { id, type, createdAt, user, description, received_amount, currency, prev_balance, equivalent_amount, post_balance } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!type) throw CustomError.badRequest('Falta el tipo');
        if (!createdAt) throw CustomError.badRequest('Falta la fecha de creación');
        if (!user) throw CustomError.badRequest('Falta el usuario');
        // if (!description) throw CustomError.badRequest('Falta la descripción');
        if (!received_amount) throw CustomError.badRequest('Falta el monto recibido');
        if (!currency) throw CustomError.badRequest('Falta la moneda');
        if (!prev_balance) throw CustomError.badRequest('Falta el saldo anterior');
        if (!equivalent_amount) throw CustomError.badRequest('Falta el monto');
        if (!post_balance) throw CustomError.badRequest('Falta el saldo posterior'); 

        return new ProjectAccountTransactionEntity(
            id,
            createdAt,
            user.name,
            type,
            description,
            received_amount,
            currency.symbol,
            currency.is_monetary,
            prev_balance,
            equivalent_amount,
            post_balance,
        );
    }
}