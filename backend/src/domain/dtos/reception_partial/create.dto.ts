export class ReceptionPartialDto {
    private constructor(
        public id_purchase_item: number,
        public quantity_received: number,
        public id_user: number,
    ) { }

    static create(object: { [key: string]: any }): [string?, ReceptionPartialDto?] {
        const { id_purchase_item, quantity_received, id_user } = object;

        if (!id_purchase_item) return ['El identificador del ítem de compra es requerido'];
        if (!quantity_received) return ['La cantidad recibida es requerida'];
        if (!id_user) return ['El identificador del usuario es requerido'];

        return [undefined, new ReceptionPartialDto(id_purchase_item, quantity_received, id_user)];
    }
}