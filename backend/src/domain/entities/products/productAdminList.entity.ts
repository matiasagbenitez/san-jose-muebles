import { CustomError } from '../../errors/custom.error';

export class ProductAdminListEntity {
    constructor(
        public id: number,

        public brand: string,
        public category: string,
        public unit: string,
        public name: string,

        public actual_stock: number,
        public inc_stock: number = 0,
        public min_stock: number = 0,

        public last_price: string,
        public monetary: boolean,
        public currency: string,
        public unit_name: string,
        public actual_stock_value: string,

        public code?: string,
    ) { }

    static fromObject(object: { [key: string]: any }): ProductAdminListEntity {
        const { id, brand, category, unit, name, actual_stock, inc_stock, min_stock, last_price, currency, code } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!brand) throw CustomError.badRequest('Falta la marca');
        if (!category) throw CustomError.badRequest('Falta la categoría');
        if (!unit) throw CustomError.badRequest('Falta la unidad de medida');
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

        return new ProductAdminListEntity(
            id,

            brand.name,
            category.name,
            unit.symbol,
            name,

            actual_stock,
            inc_stock,
            min_stock,

            price_formatted,
            currency.is_monetary,
            currency.symbol,
            unit.name,
            total_formatted,

            code
        );
         
    }
}