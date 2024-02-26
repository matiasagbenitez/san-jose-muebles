import { CustomError } from '../errors/custom.error';

export class CountryEntity {
    constructor(
        public id: string,
        public name: string,
    ) { }

    static fromObject(object: { [key: string]: any }): CountryEntity {

        const { id, name } = object;

        if (!id) throw CustomError.badRequest('Missing id');
        if (!name) throw CustomError.badRequest('Missing name');

        return new CountryEntity(
            id,
            name,
        );
    }
}