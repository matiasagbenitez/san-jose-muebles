import { CustomError } from '../../errors/custom.error';

interface CurrencyInterface {
    name: string;
    symbol: string;
    is_monetary: boolean;

}

interface ProjectInterface { 
    id: string; 
    title: string;
    client: string; 
    locality: string; 
}

interface AccountInterface { 
    id: string; 
    project: ProjectInterface;
    currency: CurrencyInterface; 
}

export class ProjectTransactionDetailEntity {
    constructor(
        public id: string,

        // ACCOUNT
        public account: AccountInterface,

        // TRANSACTION
        public type: 'NEW_PAYMENT' | 'POS_ADJ' | 'NEG_ADJ' | 'NEW_SUPPLIER_PAYMENT' | 'DEL_SUPPLIER_PAYMENT',
        public description: string,
        public received_amount: number,
        public received_currency: CurrencyInterface,

        // BALANCE
        public prev_balance: number,
        public equivalent_amount: number,
        public post_balance: number,

        // AUDIT
        public user: string,
        public createdAt: Date,

    ) { }

    static fromObject(object: { [key: string]: any }): ProjectTransactionDetailEntity {
        const {
            id,

            account,

            type,
            description,
            received_amount,
            currency,
            prev_balance,
            equivalent_amount,
            post_balance,

            user,
            createdAt,

        } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!account) throw CustomError.badRequest('Falta la cuenta del proyecto');
        if (!account.project) throw CustomError.badRequest('Falta el proyecto de la cuenta del proyecto');
        if (!account.project.client) throw CustomError.badRequest('Falta el cliente del proyecto de la cuenta del proyecto');
        if (!account.project.locality) throw CustomError.badRequest('Falta la localidad del proyecto de la cuenta del proyecto');
        if (!account.currency) throw CustomError.badRequest('Falta la moneda de la cuenta del proyecto');

        if (!type) throw CustomError.badRequest('Falta el tipo');
        if (!received_amount) throw CustomError.badRequest('Falta el monto recibido');
        if (!currency) throw CustomError.badRequest('Falta la moneda');
        if (!prev_balance) throw CustomError.badRequest('Falta el saldo anterior');
        if (!equivalent_amount) throw CustomError.badRequest('Falta el monto');
        if (!post_balance) throw CustomError.badRequest('Falta el saldo posterior');

        if (!user) throw CustomError.badRequest('Falta el usuario');
        if (!createdAt) throw CustomError.badRequest('Falta la fecha de creación');

        const account_project: ProjectInterface = {
            id: account.project.id,
            title: account.project.title,
            client: account.project.client.name + ' ' + account.project.client.last_name,
            locality: account.project.locality.name,
        }

        const account_currency: CurrencyInterface = {
            name: account.currency.name,
            symbol: account.currency.symbol,
            is_monetary: account.currency.is_monetary,
        }

        const transaction_currency: CurrencyInterface = {
            name: currency.name,
            symbol: currency.symbol,
            is_monetary: currency.is_monetary,
        }

        return new ProjectTransactionDetailEntity(
            id,
            {
                id: account.id,
                project: account_project,
                currency: account_currency,
            },
            type,
            description,
            received_amount,
            transaction_currency,
            prev_balance,
            equivalent_amount,
            post_balance,
            user.name,
            createdAt,
        );
    }
}