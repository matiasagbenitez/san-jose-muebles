export class AdjustProductStockDto {
    private constructor(
        public op: 'add' | 'sub',
        public quantity: number,
        public comment?: string,
    ) { }

    static create(object: { [key: string]: any }): [string?, AdjustProductStockDto?] {
        const { op, quantity, comment } = object;

        if (!op) return ['La operación es requerida'];
        if (op !== 'add' && op !== 'sub') return ['La operación no es válida'];
        if (!quantity) return ['La cantidad es requerida'];
        if (quantity <= 0) return ['La cantidad debe ser mayor a 0'];
        if (isNaN(quantity)) return ['La cantidad debe ser un número'];

        return [undefined, new AdjustProductStockDto(op, quantity, comment)];
    }
}