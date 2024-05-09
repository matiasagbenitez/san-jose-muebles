import { CustomError } from '../../errors/custom.error';

export class ClientDetailEntity {
    constructor(
        public id: string,
        public name: string,
        public last_name: string,
        public dni_cuit: string,
        public id_locality: number,
        public locality: string,
        public address: string,
        public phone: string,
        public email: string,
        public annotations: string,
    ) { }

    static fromObject(object: { [key: string]: any }): ClientDetailEntity {
        const { id, name, last_name, dni_cuit, phone, email, address, id_locality, locality, annotations } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!name) throw CustomError.badRequest('Falta el nombre del cliente');
        if (!last_name) throw CustomError.badRequest('Falta el apellido del cliente');
        if (!id_locality) throw CustomError.badRequest('Falta la localidad del cliente');

        return new ClientDetailEntity(
            id,
            name,
            last_name,
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