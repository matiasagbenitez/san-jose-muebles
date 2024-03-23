export class PurchaseTransactionInDto {
    private constructor(
        
        public date: Date,
        public amount_in: number,
        public id_user: number,
    ) { }

    static create(object: { [key: string]: any }): [string?, PurchaseTransactionInDto?] {

        const { date, amount_in, id_user } = object;

        if (!date) return ['La fecha es requerida'];
        if (!amount_in) return ['El monto de entrada es requerido'];
        if (!id_user) return ['El ID del usuario es requerido'];

        return [
            undefined,
            new PurchaseTransactionInDto(
                date,
                amount_in,
                id_user
            )
        ];
    }
}