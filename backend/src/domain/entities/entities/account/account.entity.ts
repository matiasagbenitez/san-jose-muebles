import { CustomError } from '../../../errors/custom.error';

export class EntityAccountEntity {
    constructor(
        public id: number,
        public entity: string,
        public locality: string,

        public currency: {
            id: number,
            name: string,
            symbol: string,
            is_monetary: boolean,
        },

        public balance: number,
    ) { }

    static fromObject(object: { [key: string]: any }): EntityAccountEntity {
        const { id, entity, currency, balance } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!entity) throw CustomError.badRequest('Falta la entidad');
        if (!currency) throw CustomError.badRequest('Falta la moneda');
        if (!balance) throw CustomError.badRequest('Falta el saldo');

        return new EntityAccountEntity(
            id,
            entity.name,
            entity.locality.name,
            {
                id: currency.id,
                name: currency.name,
                symbol: currency.symbol,
                is_monetary: currency.is_monetary,
            },
            balance
        );
    }
}