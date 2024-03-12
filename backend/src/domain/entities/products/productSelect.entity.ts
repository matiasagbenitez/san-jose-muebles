import { CustomError } from '../../errors/custom.error';

export class ProductSelectEntity {
    constructor(
        public id: number,
        public brand: string,
        public name: string,
        public code?: string,
    ) { }

    static fromObject(object: { [key: string]: any }): ProductSelectEntity {
        const { id, brand, name, code } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!brand) throw CustomError.badRequest('Falta la marca');
        if (!name) throw CustomError.badRequest('Falta el nombre');

        return new ProductSelectEntity(
            id,
            brand.name,
            name,
            code,
        );
         
    }
}