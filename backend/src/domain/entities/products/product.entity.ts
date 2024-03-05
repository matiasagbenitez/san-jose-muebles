import { CustomError } from '../../errors/custom.error';

export class ProductEntity {
    constructor(
        public id: string,
        public code: string,
        public name: string,
        public description: string,
        public id_brand: string,
        public id_category: string,
        public actual_stock: string,
        public next_stock: string,
        public min_stock: string,
        public rep_stock: string,
        public last_price: string,
        public id_currency: string,
    ) { }

    static fromObject(object: { [key: string]: any }): ProductEntity {
        const { id, code, name, description, id_brand, id_category, actual_stock, next_stock, min_stock, rep_stock, last_price, id_currency } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!name) throw CustomError.badRequest('Falta el nombre');
        if (!id_brand) throw CustomError.badRequest('Falta la marca');
        if (!id_category) throw CustomError.badRequest('Falta la categoría');
        if (!actual_stock) throw CustomError.badRequest('Falta el stock actual');
        if (!next_stock) throw CustomError.badRequest('Falta el stock futuro');
        if (!min_stock) throw CustomError.badRequest('Falta el stock mínimo');
        if (!rep_stock) throw CustomError.badRequest('Falta el stock de reposición');
        if (!last_price) throw CustomError.badRequest('Falta el último precio');
        if (!id_currency) throw CustomError.badRequest('Falta la moneda');

        return new ProductEntity(
            id,
            code,
            name,
            description,
            id_brand,
            id_category,
            actual_stock,
            next_stock,
            min_stock,
            rep_stock,
            last_price,
            id_currency
        );
    }
}