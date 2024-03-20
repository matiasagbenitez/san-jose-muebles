import { CustomError } from '../../errors/custom.error';

export class ReceptionTotalEntity {
    constructor(
        public id: string,
        public purchase: string,
        public user: string,
        public created_at: Date,
    ) { }

    static fromObject(object: { [key: string]: any }): ReceptionTotalEntity {
        const { id, purchase, user, createdAt } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!purchase) throw CustomError.badRequest('Falta la compra');
        if (!user) throw CustomError.badRequest('Falta el usuario');
        if (!createdAt) throw CustomError.badRequest('Falta la fecha de creación');

        return new ReceptionTotalEntity(
            id,
            purchase,
            user,
            createdAt,
        );
    }
}