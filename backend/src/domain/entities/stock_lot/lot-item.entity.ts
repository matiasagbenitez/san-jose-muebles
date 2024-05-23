import { CustomError } from '../../errors/custom.error';

export class StockLotItemEntity {
    private constructor(
        public id: number,
        public product: string,
        public prev_stock: number,
        public quantity: number,
        public post_stock: number,
    ) { }

    static fromObject(object: { [key: string]: any }): StockLotItemEntity {
        const { id, product, prev_stock, quantity, post_stock } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!product) throw CustomError.badRequest('Falta el producto');
        if (!prev_stock && prev_stock !== 0) throw CustomError.badRequest('Falta el stock previo');
        if (!quantity) throw CustomError.badRequest('Falta la cantidad');
        if (!post_stock && post_stock !== 0) throw CustomError.badRequest('Falta el stock posterior');

        return new StockLotItemEntity(
            id,
            product.name,
            prev_stock,
            quantity,
            post_stock,
        );
    }
}