export class UpdateInventoryItemDTO {
    private constructor(
        public readonly id_inventory_item: number,
        public readonly prev_quantity: number,
        public readonly new_quantity: number,
        public readonly updated_by: string,
    ) { }

    static create(object: { [key: string]: any }): [string?, UpdateInventoryItemDTO?] {
        const { id_inventory_item, prev_quantity, new_quantity, updated_by } = object;

        if (!id_inventory_item) return ['El ID del ítem de inventario es requerido'];
        if (!prev_quantity) return ['La cantidad anterior es requerida'];
        if (!new_quantity) return ['La nueva cantidad es requerida'];
        if (!updated_by) return ['El usuario que actualiza la cantidad es requerido'];
        if (isNaN(prev_quantity)) return ['La cantidad anterior debe ser un número'];
        if (isNaN(new_quantity)) return ['La nueva cantidad debe ser un número'];
        if (Number(prev_quantity) < 0) return ['La cantidad anterior debe ser un número positivo'];
        if (Number(new_quantity) < 0) return ['La nueva cantidad debe ser un número positivo'];
        if (Number(prev_quantity) == Number(new_quantity)) return ['La cantidad anterior y la nueva cantidad no pueden ser iguales'];

        return [undefined, new UpdateInventoryItemDTO(id_inventory_item, prev_quantity, new_quantity, updated_by)];
    }
}