import { CustomError } from '../../errors/custom.error';

export class StockAdjustEntity {
    constructor(
        public id: number,
        public id_lot: number,
        public prev_stock: number,
        public quantity: number,
        public post_stock: number,
        public createdAt: Date,
    ) { }

    static fromObject(object: { [key: string]: any }): StockAdjustEntity {
        const { id, lot, prev_stock, quantity, post_stock, createdAt } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!lot) throw CustomError.badRequest('Falta el lote');
        if (!prev_stock) throw CustomError.badRequest('Falta el stock anterior');
        if (!quantity) throw CustomError.badRequest('Falta la cantidad');
        if (!post_stock) throw CustomError.badRequest('Falta el stock posterior');
        if (!createdAt) throw CustomError.badRequest('Falta la fecha de creación');

        return new StockAdjustEntity(
            id,
            lot.id,
            prev_stock,
            quantity,
            post_stock,
            new Date(createdAt)
        );

    }
}