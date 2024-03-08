export class NewPurchaseDto {
    private constructor(
        public id_supplier: number,
        public date: Date,
        public id_currency: number,
        public subtotal: number,
        public discount: number = 0,
        public total: number,
        public paid_amount: number = 0,
        public credit_balance: number,
        public payed_off: boolean = false,
        public fully_stocked: boolean = false,
        public nullified: boolean = false,
    ) { }

    static create(object: { [key: string]: any }): [string?, NewPurchaseDto?] {
        const {
            id_supplier,
            date,
            id_currency,
            subtotal,
            discount,
            total,
            paid_amount,
            credit_balance,
            payed_off,
            fully_stocked,
            nullified,
        } = object;

        if (!id_supplier) return ['El ID del proveedor es requerido'];
        if (!date) return ['La fecha es requerida'];
        if (!(date instanceof Date)) return ['La fecha tiene un formato inválido'];
        if (!id_currency) return ['El ID de la moneda es requerido'];
        if (!subtotal) return ['El subtotal es requerido'];
        if (!total) return ['El total es requerido'];
        if (!credit_balance) return ['El crédito es requerido'];

        return [undefined, new NewPurchaseDto(
            id_supplier,
            date,
            id_currency,
            subtotal,
            discount,
            total,
            paid_amount,
            credit_balance,
            payed_off,
            fully_stocked,
            nullified,
        )];
    }
}