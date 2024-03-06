import { CustomError } from '../../errors/custom.error';

export class ProductEntity {
    constructor(
        public id: string,

        public id_brand: number,            // FORM
        public brand: string,
        public id_category: number,         // FORM
        public category: string,
        public id_unit: number,             // FORM
        public unit: string,
        public unit_symbol: string,

        public code: string,                // FORM
        public name: string,                // FORM
        public description: string,         // FORM

        public actual_stock: number,        // FORM
        public inc_stock: number = 0,       // FORM
        public min_stock: number = 0,       // FORM
        public rep_stock: number = 0,       // FORM

        public last_price: string,          // FORM
        public id_currency: number,         // FORM
        public currency: string,
        public currency_symbol: string,
        public price_monetary: boolean,

        public stock_value: string,

    ) { }

    static fromObject(object: { [key: string]: any }): ProductEntity {
        const { id, id_brand, brand, id_category, category, id_unit, unit, code, name, description, actual_stock, inc_stock, min_stock, rep_stock, last_price, id_currency, currency } = object;
        
        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!name) throw CustomError.badRequest('Falta el nombre');
        if (!id_brand) throw CustomError.badRequest('Falta la marca');
        if (!id_category) throw CustomError.badRequest('Falta la categoría');
        if (!id_unit) throw CustomError.badRequest('Falta la unidad de medida');
        if (actual_stock === undefined || actual_stock === null || actual_stock === '') throw CustomError.badRequest('Falta el stock actual');
        if (last_price === undefined || last_price === null || last_price === '') throw CustomError.badRequest('Falta el último precio');
        if (!id_currency) throw CustomError.badRequest('Falta la moneda');

        const lp_formatted = Intl.NumberFormat('es-ES', {
            minimumFractionDigits: 2
        }).format(parseFloat(last_price));

        const stock_value = Intl.NumberFormat('es-ES', {
            minimumFractionDigits: 2
        }).format(actual_stock * parseFloat(last_price));

        return new ProductEntity(
            id,
            id_brand,
            brand.name,
            id_category,
            category.name,
            id_unit,
            unit.name,
            unit.symbol,
            code,
            name,
            description,
            actual_stock,
            inc_stock,
            min_stock,
            rep_stock,
            lp_formatted,
            id_currency,
            currency.name,
            currency.symbol,
            currency.is_monetary,
            stock_value
        );
    }
}