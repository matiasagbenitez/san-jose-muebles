export class ProductDto {
    private constructor(

        public name: string,
        public id_brand: number,
        public id_category: number,
        public id_currency: number,
        public id_unit: number = 1,

        // STOCK
        public actual_stock: number = 0,
        public min_stock: number = 0,
        public rep_stock: number = 0,
        public last_price: number = 0,
        
        public code?: string,
        public description?: string,
        public inc_stock?: number,

    ) { }

    static create(object: { [key: string]: any }): [string?, ProductDto?] {
        const {
            name,
            id_brand,
            id_category,
            id_currency,
            id_unit,

            actual_stock,
            min_stock,
            rep_stock,
            last_price,

            code,
            description,
            inc_stock,
        } = object;

        if (!name) return ['El nombre es requerido'];
        if (!id_brand) return ['La marca es requerida'];
        if (!id_category) return ['La categoría es requerida'];
        if (!id_currency) return ['La moneda es requerida'];
        if (!id_unit) return ['La unidad de medida es requerida'];

        return [undefined, new ProductDto(
            name,
            id_brand,
            id_category,
            id_currency,
            id_unit,

            actual_stock,
            min_stock,
            rep_stock,
            last_price,

            code,
            description,
            inc_stock,
        )];
    }
}