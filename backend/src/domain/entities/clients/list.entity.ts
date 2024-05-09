import { CustomError } from '../../errors/custom.error';

export class ClientListEntity {
    constructor(
        public id: string,
        public name: string,
        public phone: string,
        public locality: string,
        public province: string,
    ) { }

    static fromObject(object: { [key: string]: any }): ClientListEntity {
        const { id, name, last_name, phone, locality } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!name) throw CustomError.badRequest('Falta el nombre del cliente');
        if (!last_name) throw CustomError.badRequest('Falta el apellido del cliente');
        if (!locality) throw CustomError.badRequest('Falta la localidad del cliente');
        if (!locality.province) throw CustomError.badRequest('Falta la provincia de la localidad del cliente');

        return new ClientListEntity(
            id,
            last_name + ' ' + name,
            phone,
            locality.name,
            locality.province.name,
        );
    }
}