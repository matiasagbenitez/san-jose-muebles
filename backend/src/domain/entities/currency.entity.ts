import { CustomError } from '../errors/custom.error';

export class CurrencyEntity {
    constructor(
        public id: string,
        public name: string,
        public symbol: string,
        public is_monetary: boolean = true,
    ) { }

    static fromObject(object: { [key: string]: any }): CurrencyEntity {

        const { id, name, symbol, is_monetary } = object;

        if (!id) throw CustomError.badRequest('Missing id');
        if (!name) throw CustomError.badRequest('Missing name');
        if (!symbol) throw CustomError.badRequest('Missing symbol');
        if (is_monetary === undefined) throw CustomError.badRequest('Missing is_monetary');

        return new CurrencyEntity(
            id,
            name,
            symbol,
            is_monetary,
        );
    }
}