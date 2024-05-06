export class UpdateInventoryItemStatusDTO {
    private constructor(
        public readonly status: 'RESERVADO' | 'OPERATIVO' | 'RETIRADO' | 'DESCARTADO',
    ) { }

    static create(object: { [key: string]: any }): [string?, UpdateInventoryItemStatusDTO?] {
        const { status } = object;

        if (!status) return ['El estado del item de inventario es requerido'];

        return [undefined, new UpdateInventoryItemStatusDTO(status)];
    }
}