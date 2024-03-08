export class ProductPriceDto {
    private constructor(
        public id_currency: number,
        public last_price: number,
    ) { }

    static create(object: { [key: string]: any }): [string?, ProductPriceDto?] {
        const {
            id_currency,
            last_price,
        } = object;

        if (!id_currency) return ['La moneda es requerida'];    
        if (last_price === undefined || last_price === null || last_price === '') return ['El último precio es requerido'];

        return [undefined, new ProductPriceDto(
            id_currency,
            last_price,
        )];
    }
}