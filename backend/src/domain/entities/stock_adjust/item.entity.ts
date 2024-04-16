import { CustomError } from '../../errors/custom.error';

export class StockAdjustEntity {
    constructor(
        public id: number,
        public updated_at: Date,
        public user: string,
        public comment: string,
        public prev_stock: number,
        public quantity: number,
        public post_stock: number,
    ) { }

    static fromObject(object: { [key: string]: any }): StockAdjustEntity {
        const { id, updatedAt, user, comment, prev_stock, quantity, post_stock } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!updatedAt) throw CustomError.badRequest('Falta la fecha de actualización');
        if (!user) throw CustomError.badRequest('Falta el usuario');
        // if (!comment) throw CustomError.badRequest('Falta el comentario');
        if (!prev_stock) throw CustomError.badRequest('Falta el stock previo');
        if (!quantity) throw CustomError.badRequest('Falta la cantidad');
        if (!post_stock) throw CustomError.badRequest('Falta el stock posterior');

        return new StockAdjustEntity(
            id,
            new Date(updatedAt),
            user.name,
            comment,
            prev_stock,
            quantity,
            post_stock,
        );

    }
}