import { CustomError } from '../../errors/custom.error';

export class SupplierSelectEntity {
    constructor(
        public id: string,
        public name: string,
        public locality: string,
    ) { }

    static fromObject(object: { [key: string]: any }): SupplierSelectEntity {

        const { id, name, locality } = object;

        if (!id) throw CustomError.badRequest('Missing id');
        if (!name) throw CustomError.badRequest('Missing name');
        if (!locality) throw CustomError.badRequest('Missing locality');

        return new SupplierSelectEntity(
            id,
            name,
            locality.name + ', ' + locality.province.name
        );
    }
}