import { CustomError } from '../../errors/custom.error';

export class ProductEditableEntity {
    constructor(
        public id: string,
        public code: string,
        public name: string,
        public description: string,
        public id_brand: string,
        public id_category: string,
        public id_unit: string,
        public actual_stock: number,
        public inc_stock: number,
        public min_stock: number,
        public ideal_stock: number,
        public last_price: number,
        public id_currency: string
    ) { }

    static fromObject(object: { [key: string]: any }): ProductEditableEntity {
        const {
            id,
            code,
            name,
            description,
            id_brand,
            id_category,
            id_unit,
            actual_stock,
            inc_stock,
            min_stock,
            ideal_stock,
            last_price,
            id_currency
        } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!code) throw CustomError.badRequest('Falta el código');
        if (!name) throw CustomError.badRequest('Falta el nombre');
        if (!id_brand) throw CustomError.badRequest('Falta la marca');
        if (!id_category) throw CustomError.badRequest('Falta la categoría');
        if (!id_unit) throw CustomError.badRequest('Falta la unidad de medida');
        if (isNaN(actual_stock)) throw CustomError.badRequest('El stock actual debe ser un número');
        if (isNaN(inc_stock)) throw CustomError.badRequest('El stock a recibir debe ser un número');
        if (isNaN(min_stock)) throw CustomError.badRequest('El stock mínimo debe ser un número');
        if (isNaN(ideal_stock)) throw CustomError.badRequest('El stock ideal debe ser un número');
        if (isNaN(last_price)) throw CustomError.badRequest('El precio debe ser un número');
        if (!id_currency) throw CustomError.badRequest('Falta la moneda');

        return new ProductEditableEntity(
            id,
            code,
            name,
            description,
            id_brand,
            id_category,
            id_unit,
            actual_stock,
            inc_stock,
            min_stock,
            ideal_stock,
            last_price,
            id_currency
        );
    }
}