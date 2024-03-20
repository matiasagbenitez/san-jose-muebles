import { CustomError } from '../../errors/custom.error';

export class ReceptionPartialEntity {
    constructor(
        public id: string,
        public product: string,
        public quantity: number,
        public user: string,
        public created_at: Date,
    ) { }

    static fromObject(object: { [key: string]: any }): ReceptionPartialEntity {
        const { id, item, quantity_received, user, createdAt } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!item) throw CustomError.badRequest('Falta el ítem');
        if (!quantity_received) throw CustomError.badRequest('Falta la cantidad recibida');
        if (!user) throw CustomError.badRequest('Falta el usuario');
        if (!createdAt) throw CustomError.badRequest('Falta la fecha de creación');

        return new ReceptionPartialEntity(
            id,
            item.product.name,
            quantity_received,
            user.name,
            createdAt,
        );
    }
}