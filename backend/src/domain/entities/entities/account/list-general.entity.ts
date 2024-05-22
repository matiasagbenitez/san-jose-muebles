import { CustomError } from '../../../errors/custom.error';

export class EntityAccountGeneralListEntity {
    constructor(
        public id: string,
        public entity: {
            id: string,
            name: string,
        },
        public currency: {
            name: string,
            symbol: string,
            is_monetary: boolean,
        },
        public balance: number,
        public updatedAt?: Date
    ) { }

    static fromObject(object: { [key: string]: any }): EntityAccountGeneralListEntity {
        const { id, entity, currency, balance, updatedAt } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!entity) throw CustomError.badRequest('Falta la entidad');
        if (!currency) throw CustomError.badRequest('Falta la moneda');
        if (!balance) throw CustomError.badRequest('Falta el saldo');

        return new EntityAccountGeneralListEntity(
            id,
            {
                id: entity.id,
                name: entity.name,
            },
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