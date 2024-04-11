export class TransactionDto {
    private constructor(
        public id_supplier_account: number,
        public type: string,
        public description: string,
        public amount: number,
    ) { }

    static create(object: { [key: string]: any }): [string?, TransactionDto?] {

        const { id_supplier_account, type, description, amount } = object;

        if (!id_supplier_account) return ['El ID de la cuenta del proveedor es requerido'];
        if (!type) return ['El tipo de transacción DEL_IN es requerido'];
        if (!description) return ['La descripción de la transacción DEL_IN es requerida'];
        if (typeof description !== 'string') return ['La descripción de la transacción DEL_IN debe ser de tipo cadena'];
        if (!amount) return ['El monto de la transacción DEL_IN es requerido'];
        if (typeof amount !== 'number') return ['El monto de la transacción DEL_IN debe ser de tipo numérico'];
        if (amount <= 0) return ['El monto de la transacción DEL_IN debe ser un número mayor a 0'];

        return [
            undefined,
            new TransactionDto(
                id_supplier_account,
                type,
                description,
                amount,
            )
        ];
    }
}