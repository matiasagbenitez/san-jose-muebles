import { CustomError } from '../../errors/custom.error';

export class EntityListEntity {
    constructor(
        public id: string,
        public name: string,
        public dni_cuit: string,
        public phone: string,
        public locality: string,
        public province: string,
    ) { }

    static fromObject(object: { [key: string]: any }): EntityListEntity {
        const { id, name, dni_cuit, phone, locality } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!name) throw CustomError.badRequest('Falta el nombre de la entidad');
        if (!locality) throw CustomError.badRequest('Falta la localidad de la entidad');
        if (!locality.province) throw CustomError.badRequest('Falta la provincia de la localidad de la entidad');

        return new EntityListEntity(
            id,
            name,
            dni_cuit,
            phone,
            locality.name,
            locality.province.name,
        );
    }
}