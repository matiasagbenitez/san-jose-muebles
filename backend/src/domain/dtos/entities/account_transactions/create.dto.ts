export class CreateEntityTransactionDTO {
    private constructor(
        public id_entity_account: number,
        public type: 'PAYMENT' | 'DEBT' | 'POS_ADJ' | 'NEG_ADJ',
        public description: string,
        public amount: number,
        public id_user: number
    ) { }

    static create(object: { [key: string]: any }): [string?, CreateEntityTransactionDTO?] {

        const { id_entity_account, type, description, amount, id_user } = object;

        if (!id_entity_account) return ['El ID de la cuenta de la entidad es requerido'];
        if (!type) return ['El tipo de movimiento es requerido'];
        if (!description) return ['La descripción del movimiento es requerida'];
        if (!amount) return ['El monto del movimiento es requerido'];
        if (amount <= 0) return ['El monto del movimiento debe ser un número mayor a 0'];
        if (!id_user) return ['El ID del usuario es requerido'];

        return [
            undefined,
            new CreateEntityTransactionDTO(
                id_entity_account,
                type,
                description,
                amount,
                id_user
            )
        ];
    }
}