export class StockAdjustDto {
    private constructor(
        public id_product: number,
        public prev_stock: number,
        public quantity: number,
        public post_stock: number,
        public id_user: number,
        public comment?: string,
    ) { }

    static create(object: { [key: string]: any }): [string?, StockAdjustDto?] {
        const {
            id_product,
            actual_stock,
            op,
            quantity,
            id_user,
            comment
        } = object;

        if (!id_product) return ['El ID del producto es requerido'];
        if (actual_stock === undefined) return ['El stock actual es requerido'];
        if (!op) return ['La operación es requerida'];
        if (op !== 'add' && op !== 'sub') return ['La operación no es válida'];
        if (quantity === undefined) return ['La cantidad es requerida'];
        if (quantity <= 0) return ['La cantidad debe ser mayor a 0'];
        if (isNaN(quantity)) return ['La cantidad debe ser un número'];
        if (!id_user) return ['El ID del usuario es requerido'];

        const prev_stock = Number(actual_stock);
        const quantity_number = op === 'add' ? Number(quantity) : -Number(quantity);
        const post_stock = prev_stock + quantity_number;

        return [undefined, new StockAdjustDto(id_product, prev_stock, quantity_number, post_stock, id_user, comment)];
    }
}