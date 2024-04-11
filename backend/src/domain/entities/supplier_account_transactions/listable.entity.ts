import { CustomError } from '../../errors/custom.error';

export class SupplierAccountTransactionEntity {
    constructor(
        public id: string,
        public createdAt: Date,
        public user: string,
        public type: string,
        public description: string,
        public prev_balance: number,
        public amount: number,
        public post_balance: number,
        public id_purchase?: number,
        public id_project?: number,
    ) { }

    static fromObject(object: { [key: string]: any }): SupplierAccountTransactionEntity {
        const { id, type, createdAt, user, description, prev_balance, amount, post_balance, purchase_transaction } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!type) throw CustomError.badRequest('Falta el tipo');
        if (!createdAt) throw CustomError.badRequest('Falta la fecha de creación');
        if (!user) throw CustomError.badRequest('Falta el usuario');
        if (!description) throw CustomError.badRequest('Falta la descripción');
        if (!prev_balance) throw CustomError.badRequest('Falta el saldo anterior');
        if (!amount) throw CustomError.badRequest('Falta el monto');
        if (!post_balance) throw CustomError.badRequest('Falta el saldo posterior');

        return new SupplierAccountTransactionEntity(
            id,
            createdAt,
            user.name,
            type,
            description,
            prev_balance,
            amount,
            post_balance,
            purchase_transaction ? purchase_transaction.id_purchase : undefined,
        );
    }
}