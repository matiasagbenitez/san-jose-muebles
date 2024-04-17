export class RetireInventoryItemDTO {
    private constructor(
        public readonly id_inventory_item: number,
        public readonly retired_by: number,
        public readonly reason: string,
    ) { }

    static create(object: { [key: string]: any }): [string?, RetireInventoryItemDTO?] {
        const { id_inventory_item, retired_by, reason } = object;

        if (!id_inventory_item) return ['El ID del ítem de inventario es requerido'];
        if (!retired_by) return ['El ID del usuario que retira el ítem de inventario es requerido'];
        if (!reason) return ['La razón del retiro del ítem de inventario es requerida'];

        return [undefined, new RetireInventoryItemDTO(id_inventory_item, retired_by, reason)];
    }
}