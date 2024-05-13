import { CustomError } from '../../errors/custom.error';

export class SupplierBasicEntity {
    constructor(
        public id: string,
        public name: string,
        public locality: string,
    ) { }

    static fromObject(object: { [key: string]: any }): SupplierBasicEntity {
        const { id, name, locality } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!name) throw CustomError.badRequest('Falta el nombre');
        if (!locality) throw CustomError.badRequest('Falta la localidad');

        return new SupplierBasicEntity(
            id,
            name,
            locality.name + ', ' + locality.province.name
        );
    }
}