import { CustomError } from '../../errors/custom.error';

interface ProductReception {
    id: number;
    user: string;
    date: Date;
    quant: number;
}

export class PartialReceptionEntity {
    constructor(
        public id: number,
        public prod: string,
        public quant: number,
        public recep: ProductReception[],
    ) { }

    static fromObject(object: { [key: string]: any }): PartialReceptionEntity {
        const { id, product, quantity, receptions } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!product) throw CustomError.badRequest('Falta el producto');
        if (!quantity) throw CustomError.badRequest('Falta la cantidad');
        if (!receptions) throw CustomError.badRequest('Falta la recepción');

        const product_receptions = receptions.map((reception: any) => {
            const { id, user, createdAt, quantity_received } = reception;

            if (!id) throw CustomError.badRequest('Falta el ID');
            if (!user) throw CustomError.badRequest('Falta el usuario');
            if (!createdAt) throw CustomError.badRequest('Falta la fecha');
            if (!quantity_received) throw CustomError.badRequest('Falta la cantidad recibida');

            return {
                id,
                user: user.name,
                date: createdAt,
                quant: quantity_received,
            };
        });

        return new PartialReceptionEntity(
            id,
            product,
            quantity,
            product_receptions,
        );

    }
}