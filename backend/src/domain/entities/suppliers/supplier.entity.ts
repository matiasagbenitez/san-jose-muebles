import { CustomError } from '../../errors/custom.error';

export class SupplierEntity {
    constructor(
        public id: string,
        public name: string,
        public dni_cuit: string,
        public phone: string,
        
        public email?: string,
        public address?: string,
        
        public id_locality?: number,
        public annotations?: string,

        public locality?: string,
    ) { }

    static fromObject(object: { [key: string]: any }): SupplierEntity {
        const { id, name, dni_cuit, phone, email, address, id_locality, locality, annotations } = object;

        if (!id) throw CustomError.badRequest('Missing id');
        if (!name) throw CustomError.badRequest('Missing name');
        if (!id_locality) throw CustomError.badRequest('Missing locality');

        return new SupplierEntity(
            id,
            name,
            dni_cuit,
            phone,
            email,
            address,
            id_locality,
            annotations,
            locality.name + ", " + locality.province.name,
        );
    }

    static listableSupplier(object: { [key: string]: any }): SupplierEntity {
        const { id, name, phone, dni_cuit, locality } = object;

        if (!id) throw CustomError.badRequest('Missing id');
        if (!name) throw CustomError.badRequest('Missing name');
        if (!locality) throw CustomError.badRequest('Missing locality');

        return new SupplierEntity(
            id,
            name,
            dni_cuit,
            phone,
            undefined,
            undefined,
            undefined,
            undefined,
            locality.name + ", " + locality.province.name,
        );
    }
}