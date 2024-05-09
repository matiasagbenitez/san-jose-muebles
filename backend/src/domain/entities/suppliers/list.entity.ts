import { CustomError } from '../../errors/custom.error';

export class SupplierListEntity {
    constructor(
        public id: string,
        public name: string,
        public dni_cuit: string,
        public phone: string,
        public locality: string,
        public province: string,
    ) { }

    static fromObject(object: { [key: string]: any }): SupplierListEntity {
        const { id, name, dni_cuit, phone, locality } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!name) throw CustomError.badRequest('Falta el nombre del proveedor');
        if (!locality) throw CustomError.badRequest('Falta la localidad del proveedor');
        if (!locality.province) throw CustomError.badRequest('Falta la provincia de la localidad del proveedor');

        return new SupplierListEntity(
            id,
            name,
            dni_cuit,
            phone,
            locality.name,
            locality.province.name,
        );
    }
}