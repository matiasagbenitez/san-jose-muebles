export class ProductStockDto {
    private constructor(
        public id_unit: number,
        public min_stock: number,
        public ideal_stock: number,
    ) { }

    static create(object: { [key: string]: any }): [string?, ProductStockDto?] {
        const {
            id_unit,
            min_stock,
            ideal_stock,
        } = object;

        if (!id_unit) return ['La unidad de medida es requerida'];
        if (min_stock === undefined || min_stock === null || min_stock === '') return ['El stock mínimo es requerido'];
        if (ideal_stock === undefined || ideal_stock === null || ideal_stock === '') return ['El stock ideal es requerido'];

        return [undefined, new ProductStockDto(
            id_unit,
            min_stock,
            ideal_stock,
        )];
    }
}