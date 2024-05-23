interface StockItem {
    id_product: number,
    quantity: number,
}

export class CreateStockLotDTO {
    private constructor(
        public type: 'INCREMENT' | 'DECREMENT',
        public description: string,
        public id_user: number,
        public stock_list: StockItem[] = [],
    ) { }

    static create(object: { [key: string]: any }): [string?, CreateStockLotDTO?] {
        const { type, description, id_user, stock_list } = object;

        if (!type) return ['El tipo de ajuste es requerido'];
        if (type !== 'INCREMENT' && type !== 'DECREMENT') return ['El tipo de ajuste no es válido'];
        if (!description) return ['La descripción es requerida'];
        if (!id_user) return ['El usuario es requerido'];

        // Revisar que stock_list cumpla con el formato
        if (!stock_list) return ['La lista de productos es requerida'];
        if (!Array.isArray(stock_list)) return ['La lista de productos debe ser un arreglo'];
        if (stock_list.length === 0) return ['La lista de productos no puede estar vacía'];

        // Revisar que cada item de stock_list cumpla con el formato
        for (const item of stock_list) {
            if (!item.id_product) return ['El ID de producto es requerido'];
            if (!item.quantity) return ['La cantidad es requerida'];
            if (typeof item.id_product !== 'number') return ['El ID de producto debe ser un número'];
            if (typeof item.quantity !== 'number') return ['La cantidad debe ser un número'];
            if (item.quantity <= 0) return ['La cantidad debe ser mayor a 0'];
        }

        return [undefined, new CreateStockLotDTO(
            type,
            description,
            id_user,
            stock_list,
        )];
    }
}