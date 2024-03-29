import { CustomError } from '../../errors/custom.error';

export class ProductListEntity {
    constructor(
        public id: number,

        public brand: string,
        public category: string,
        public unit: string,
        public name: string,

        public actual_stock: number = 0,
        public inc_stock: number = 0,
        public min_stock: number = 0,
        public ideal_stock: number = 0,

        public total_stock: number = 0,
        public is_low_stock: boolean = false,

        public code?: string,
    ) { }

    static fromObject(object: { [key: string]: any }): ProductListEntity {
        const { id, brand, category, unit, name, actual_stock, inc_stock, min_stock, ideal_stock, code } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!brand) throw CustomError.badRequest('Falta la marca');
        if (!category) throw CustomError.badRequest('Falta la categoría');
        if (!unit) throw CustomError.badRequest('Falta la unidad de medida');
        if (!name) throw CustomError.badRequest('Falta el nombre');

        if (isNaN(actual_stock)) throw CustomError.badRequest('El stock actual debe ser un número');
        if (isNaN(inc_stock)) throw CustomError.badRequest('El stock a recibir debe ser un número');
        if (isNaN(min_stock)) throw CustomError.badRequest('El stock mínimo debe ser un número');
        if (isNaN(ideal_stock)) throw CustomError.badRequest('El stock ideal debe ser un número');

        if (code && typeof code !== 'string') throw CustomError.badRequest('El código debe ser un texto');

        const total_stock: number = Number(actual_stock) + Number(inc_stock);
        const is_low_stock: boolean = total_stock < Number(min_stock);

        return new ProductListEntity(
            id,

            brand.name,
            category.name,
            unit.symbol,
            name,

            Number(actual_stock),
            Number(inc_stock),
            Number(min_stock),
            Number(ideal_stock),

            total_stock,
            is_low_stock,

            code
        );
         
    }
}