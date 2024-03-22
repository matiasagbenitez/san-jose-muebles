import { CustomError } from '../../errors/custom.error';

export class TotalReceptionEntity {
    constructor(
        public id: number,
        public user: string,
        public date: Date,
    ) { }

    static fromObject(object: { [key: string]: any }): TotalReceptionEntity {
        const { id, user, createdAt } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!user) throw CustomError.badRequest('Falta el nombre del usuario');
        if (!createdAt) throw CustomError.badRequest('Falta la fecha de creación');

        return new TotalReceptionEntity(
            id,
            user.name,
            createdAt,
        );

    }
}