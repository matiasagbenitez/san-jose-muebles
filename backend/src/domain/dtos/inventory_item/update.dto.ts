export class UpdateInventoryItemDTO {
    private constructor(
        public readonly id_inventory_categ: number,
        public readonly id_inventory_brand: number,
        public readonly name: string,
    ) { }

    static create(object: { [key: string]: any }): [string?, UpdateInventoryItemDTO?] {
        const { id_inventory_categ, id_inventory_brand, status, name } = object;

        if (!id_inventory_categ) return ['El ID de la categoría de inventario es requerido'];
        if (!id_inventory_brand) return ['El ID de la marca de inventario es requerido'];
        if (status) return ['El estado del item de inventario no puede ser actualizado en esta operación'];
        if (!name) return ['El nombre del item de inventario es requerido'];

        return [undefined, new UpdateInventoryItemDTO(id_inventory_categ, id_inventory_brand, name)];
    }
}