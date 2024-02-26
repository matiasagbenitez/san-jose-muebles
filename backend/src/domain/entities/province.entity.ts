import { CustomError } from '../errors/custom.error';

export class ProvinceEntity {
    constructor(
        public id: string,
        public name: string,
        public id_country: number,
        public country?: string,
    ) { }

    static fromObject(object: { [key: string]: any }): ProvinceEntity {

        const { id, name, id_country } = object;

        if (!id) throw CustomError.badRequest('Missing id');
        if (!name) throw CustomError.badRequest('Missing name');
        if (!id_country) throw CustomError.badRequest('Missing country id');

        return new ProvinceEntity(
            id,
            name,
            id_country,
        );
    }

    static fromObjectWithCountry(object: { [key: string]: any }): ProvinceEntity {
            
            const { id, name, id_country, country } = object;
    
            if (!id) throw CustomError.badRequest('Missing id');
            if (!name) throw CustomError.badRequest('Missing name');
            if (!id_country) throw CustomError.badRequest('Missing country id');
            if (!country) throw CustomError.badRequest('Missing country');
    
            return new ProvinceEntity(
                id,
                name,
                id_country,
                country.name
            );
        }
}