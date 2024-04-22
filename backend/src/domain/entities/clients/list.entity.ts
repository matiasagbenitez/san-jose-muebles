import { CustomError } from '../../errors/custom.error';

export class ClientListEntity {
    constructor(
        public id: string,
        public name: string,
        public dni_cuit: string,
        public phone: string,
        public locality: string,
    ) { }

    static fromObject(object: { [key: string]: any }): ClientListEntity {
        const { id, name, dni_cuit, phone, address, locality } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!name) throw CustomError.badRequest('Falta el nombre del cliente');
        if (!locality) throw CustomError.badRequest('Falta la localidad del cliente');


        return new ClientListEntity(
            id,
            name,
            dni_cuit,
            phone,
            locality.name,
        );
    }
}