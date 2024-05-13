export class CreateProjectAccountTransactionDTO {
    private constructor(
        public id_project_account: number,
        public type: 'NEW_PAYMENT' | 'POS_ADJ' | 'NEG_ADJ' | 'NEW_SUPPLIER_PAYMENT',
        public description: string,
        public received_amount: number,
        public id_currency: number,
        public equivalent_amount: number,
        public id_supplier_account?: number,
    ) { }

    static create(object: { [key: string]: any }): [string?, CreateProjectAccountTransactionDTO?] {

        const { id_project_account, type, description, amount, id_currency, equivalent_amount, id_supplier_account } = object;

        if (!id_project_account) return ['El ID de la cuenta del proveedor es requerido'];
        if (!type) return ['El tipo de transacción es requerido'];
        if (!id_currency) return ['El ID de la moneda es requerido'];
        // amount must be a positive number
        if (amount === undefined) return ['El monto es requerido'];
        if (typeof amount !== 'number') return ['El monto debe ser un número'];
        if (amount <= 0) return ['El monto debe ser mayor a cero'];
        // equivalent_amount must be a positive number
        if (equivalent_amount === undefined) return ['El monto equivalente es requerido'];
        if (typeof equivalent_amount !== 'number') return ['El monto equivalente debe ser un número'];
        if (equivalent_amount <= 0) return ['El monto equivalente debe ser mayor a cero'];
        if (type === 'NEW_SUPPLIER_PAYMENT') {
            if (!id_supplier_account) return ['El ID de la cuenta del proveedor es requerido'];
        }

        return [
            undefined,
            new CreateProjectAccountTransactionDTO(
                id_project_account,
                type,
                description,
                amount,
                id_currency,
                equivalent_amount,
                id_supplier_account
            )
        ];
    }
}