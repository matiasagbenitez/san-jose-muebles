export class SupplierAccountDto {
    private constructor(
        public id_supplier: number,
        public id_currency: number,
        public balance: number = 0
    ) { }

    static create(object: { [key: string]: any }): [string?, SupplierAccountDto?] {
        const { id_supplier, id_currency } = object;

        if (!id_supplier) return ['El identificador del proveedor es requerido'];
        if (!id_currency) return ['El identificador de la moneda es requerido'];

        return [undefined, new SupplierAccountDto(id_supplier, id_currency)];
    }
}