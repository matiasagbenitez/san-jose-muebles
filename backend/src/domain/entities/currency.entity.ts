import { CustomError } from '../errors/custom.error';

export class CurrencyEntity {
    constructor(
        public id: string,
        public name: string,
        public code: string,
    ) { }

    static fromObject(object: { [key: string]: any }): CurrencyEntity {

        const { id, name, code } = object;

        if (!id) throw CustomError.badRequest('Missing id');
        if (!name) throw CustomError.badRequest('Missing name');
        if (!code) throw CustomError.badRequest('Missing code');

        return new CurrencyEntity(
            id,
            name,
            code,
        );
    }
}