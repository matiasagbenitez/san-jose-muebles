import { CustomError } from '../errors/custom.error';

export class CityEntity {
    constructor(
        public id: string,
        public name: string,
        public id_province: number,
        public province?: string,
    ) { }

    static fromObject(object: { [key: string]: any }): CityEntity {

        const { id, name, id_province } = object;

        if (!id) throw CustomError.badRequest('Missing id');
        if (!name) throw CustomError.badRequest('Missing name');
        if (!id_province) throw CustomError.badRequest('Missing province id');

        return new CityEntity(
            id,
            name,
            id_province,
        );
    }

    static fromObjectWithProvince(object: { [key: string]: any }): CityEntity {

        const { id, name, id_province, province } = object;

        if (!id) throw CustomError.badRequest('Missing id');
        if (!name) throw CustomError.badRequest('Missing name');
        if (!id_province) throw CustomError.badRequest('Missing province id');
        if (!province) throw CustomError.badRequest('Missing province');

        return new CityEntity(
            id,
            name,
            id_province,
            province.name
        );
    }
}