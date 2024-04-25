import { CustomError } from '../../errors/custom.error';

export class VisitEvolutionItemEntity {
    constructor(
        public id: number,
        public status: 'PENDIENTE' | 'REALIZADA' | 'CANCELADA',
        public user: string,
        public createdAt: Date,
    ) { }

    static fromObject(object: { [key: string]: any }): VisitEvolutionItemEntity {

        const { id, status, user, createdAt } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!status) throw CustomError.badRequest('Falta el estado');
        if (!user) throw CustomError.badRequest('Falta el usuario');
        if (!createdAt) throw CustomError.badRequest('Falta la fecha de creación');

        return new VisitEvolutionItemEntity(
            id,
            status,
            user.name,
            createdAt
        );
    }
}