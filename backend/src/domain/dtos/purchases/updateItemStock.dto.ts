export class UpdateItemStockDto {
    private constructor(
        public id_purchase: number,
        public id_item: number,
        public quantity_received: number,
    ) { }

    static create(object: { [key: string]: any }): [string?, UpdateItemStockDto?] {
        const { id_purchase, id_item, quantity_received } = object;

        if (!id_purchase) return ['El identificador de la compra es requerido'];
        if (isNaN(id_purchase)) return ['El identificador de la compra debe ser un número'];
        if (!id_item) return ['El identificador del ítem es requerido'];
        if (isNaN(id_item)) return ['El identificador del ítem debe ser un número'];
        if (!quantity_received) return ['La cantidad recibida es requerida'];
        if (isNaN(quantity_received)) return ['La cantidad recibida debe ser un número'];

        // Transformamos a números
        const id_purchase_num = Number(id_purchase);
        const id_item_num = Number(id_item);
        const quantity_received_num = Number(quantity_received);

        return [undefined, new UpdateItemStockDto(id_purchase_num, id_item_num, quantity_received_num)];
    }
}