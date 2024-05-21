import { CustomError } from '../../errors/custom.error';

export class EntityDetailEntity {
    constructor(
        public id: string,
        public name: string,
        public dni_cuit: string,
        public id_locality: number,
        public locality: string,
        public address: string,
        public phone: string,
        public email: string,
        public annotations: string,
    ) { }

    static fromObject(object: { [key: string]: any }): EntityDetailEntity {
        const { id, name, dni_cuit, phone, email, address, id_locality, locality, annotations } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!name) throw CustomError.badRequest('Falta el nombre de la entidad');
        if (!id_locality) throw CustomError.badRequest('Falta la localidad de la entidad');

        return new EntityDetailEntity(
            id,
            name,
            dni_cuit,
            id_locality,
            locality.name,
            address,
            phone,
            email,
            annotations,
        );
    }
}