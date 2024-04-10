export class PurchaseTransactionInDto {
    private constructor(
        
        public amount_in: number,
        public id_user: number,
    ) { }

    static create(object: { [key: string]: any }): [string?, PurchaseTransactionInDto?] {

        const { amount_in, id_user } = object;

        if (!amount_in) return ['El monto de entrada es requerido'];
        if (!id_user) return ['El ID del usuario es requerido'];

        return [
            undefined,
            new PurchaseTransactionInDto(
                amount_in,
                id_user
            )
        ];
    }
}