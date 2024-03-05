import { CustomError } from '../../errors/custom.error';

export class ProductListEntity {
    constructor(
        public id: number,
        public brand: string,
        public category: string,
        public name: string,
        public actual_stock: number,
        public next_stock: number = 0,
        public min_stock: number = 0,
        public last_price: string,
        public monetary: boolean,
        public currency: string,
        public next_stock_value: string,
        public code?: string,
    ) { }

    static fromObject(object: { [key: string]: any }): ProductListEntity {
        const { id, brand, category, name, actual_stock, next_stock, min_stock, last_price, currency, code } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!brand) throw CustomError.badRequest('Falta la marca');
        if (!category) throw CustomError.badRequest('Falta la categoría');
        if (!name) throw CustomError.badRequest('Falta el nombre');

        if (actual_stock === undefined || actual_stock === null || actual_stock === '') throw CustomError.badRequest('Falta el stock actual');
        if (last_price === undefined || last_price === null || last_price === '') throw CustomError.badRequest('Falta el último precio');
        const price_formatted = Intl.NumberFormat('es-ES', {
            minimumFractionDigits: 2
        }).format(parseFloat(last_price));

        if (!currency) throw CustomError.badRequest('Falta la moneda');
        const total_formatted = Intl.NumberFormat('es-ES', {
            minimumFractionDigits: 2

        }).format(actual_stock * parseFloat(last_price));

        return new ProductListEntity(
            id,
            brand.name,
            category.name,
            name,
            actual_stock,
            next_stock,
            min_stock,
            price_formatted,
            currency.is_monetary,
            currency.symbol,
            total_formatted,
            code
        );
    }
}