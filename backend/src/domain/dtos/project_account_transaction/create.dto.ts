export class CreateProjectAccountTransactionDTO {
    private constructor(
        public id_project_account: number,
        public type: string | 'NEW_PAYMENT' | 'POS_ADJ' | 'NEG_ADJ',
        public description: string,
        public received_amount: number,
        public id_currency: number,
        public equivalent_amount: number,
    ) { }

    static create(object: { [key: string]: any }): [string?, CreateProjectAccountTransactionDTO?] {

        const { id_project_account, type, description, amount, id_currency, equivalent_amount } = object;

        if (!id_project_account) return ['El ID de la cuenta del proveedor es requerido'];
        if (!type) return ['El tipo de transacción DEL_IN es requerido'];
        if (!amount) return ['El monto recibido es requerido'];
        if (!id_currency) return ['El ID de la moneda es requerido'];

        return [
            undefined,
            new CreateProjectAccountTransactionDTO(
                id_project_account,
                type,
                description,
                amount,
                id_currency,
                equivalent_amount
            )
        ];
    }
}