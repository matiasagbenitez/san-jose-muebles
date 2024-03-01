import { CustomError } from '../errors/custom.error';

export class LocalityEntity {
    constructor(
        public id: string,
        public name: string,
        public id_province: number,
        public province?: string,
        public id_country?: number,
        public country?: string
    ) { }

    static fromObject(object: { [key: string]: any }): LocalityEntity {

        const { id, name, id_province } = object;

        if (!id) throw CustomError.badRequest('Missing id');
        if (!name) throw CustomError.badRequest('Missing name');
        if (!id_province) throw CustomError.badRequest('Missing province id');

        return new LocalityEntity(
            id,
            name,
            id_province,
        );
    }

    static fromObjectWithProvince(object: { [key: string]: any }): LocalityEntity {

        const { id, name, id_province, province } = object;

        if (!id) throw CustomError.badRequest('Missing id');
        if (!name) throw CustomError.badRequest('Missing name');
        if (!id_province) throw CustomError.badRequest('Missing province id');
        if (!province) throw CustomError.badRequest('Missing province');

        return new LocalityEntity(
            id,
            name,
            id_province,
            province.name
        );
    }

    static fromObjectWithProvinceAndCountry(object: { [key: string]: any }): LocalityEntity {

        const { id, name, id_province, province} = object;

        if (!id) throw CustomError.badRequest('Missing id');
        if (!name) throw CustomError.badRequest('Missing name');
        if (!id_province) throw CustomError.badRequest('Missing province id');
        if (!province) throw CustomError.badRequest('Missing province');
        if (!province.name) throw CustomError.badRequest('Missing province name');
        if (!province.id_country) throw CustomError.badRequest('Missing country id');
        if (!province.country) throw CustomError.badRequest('Missing country');

        return new LocalityEntity(
            id,
            name,
            id_province,
            province.name,
            province.id_country,
            province.country.name
        );
    }
}