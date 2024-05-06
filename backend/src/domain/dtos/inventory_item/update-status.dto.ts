export class UpdateInventoryItemStatusDTO {
    private constructor(
        public readonly comment: string,
        public readonly status: 'RESERVADO' | 'OPERATIVO' | 'RETIRADO' | 'DESCARTADO',
    ) { }

    static create(object: { [key: string]: any }): [string?, UpdateInventoryItemStatusDTO?] {
        const { comment, status } = object;

        if (!comment) return ['El comentario del item de inventario es requerido'];
        if (!status) return ['El estado del item de inventario es requerido'];

        return [undefined, new UpdateInventoryItemStatusDTO(comment, status)];
    }
}