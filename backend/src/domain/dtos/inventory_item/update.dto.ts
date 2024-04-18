export class UpdatedInventoryItemDTO {
    private constructor(
        public readonly id_inventory_categ: number,
        public readonly id_inventory_brand: number,
        public readonly quantity: number = 1,
        public readonly name: string,
    ) { }

    static create(object: { [key: string]: any }): [string?, UpdatedInventoryItemDTO?] {
        const { id_inventory_categ, id_inventory_brand, quantity, name } = object;

        if (!id_inventory_categ) return ['El ID de la categoría de inventario es requerido'];
        if (!id_inventory_brand) return ['El ID de la marca de inventario es requerido'];
        if (!quantity) return ['La cantidad del item de inventario es requerida'];
        if (isNaN(quantity)) return ['La cantidad del item de inventario debe ser un número'];
        if (!name) return ['El nombre del item de inventario es requerido'];

        return [undefined, new UpdatedInventoryItemDTO(id_inventory_categ, id_inventory_brand, quantity, name)];
    }
}