import { CustomError } from '../../../errors/custom.error';

export class EntityAccountListEntity {
    constructor(
        public id: string,
        public currency: {
            name: string,
            symbol: string,
            is_monetary: boolean,
        },
        public balance: number,
        public updatedAt?: Date
    ) { }

    static fromObject(object: { [key: string]: any }): EntityAccountListEntity {
        const { id, currency, balance, updatedAt } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!currency) throw CustomError.badRequest('Falta la moneda');
        if (!balance) throw CustomError.badRequest('Falta el saldo');

        return new EntityAccountListEntity(
            id,
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