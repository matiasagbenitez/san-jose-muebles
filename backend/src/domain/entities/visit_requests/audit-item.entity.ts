import { CustomError } from '../../errors/custom.error';

export class VisitRequestAuditEntity {
    constructor(
        public id: number,
        public action: 'ALTA' | 'BAJA' | 'MODIFICACION',
        public before: { [key: string]: any },
        public after: { [key: string]: any },
        public user: string,
        public date: Date
    ) { }

    static fromObject(object: { [key: string]: any }): VisitRequestAuditEntity {

        const { id, action, before, after, user, createdAt } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!action) throw CustomError.badRequest('Falta la acción');
        // if (!before) throw CustomError.badRequest('Falta el estado anterior');
        // if (!after) throw CustomError.badRequest('Falta el estado posterior');
        if (!user) throw CustomError.badRequest('Falta el usuario');
        if (!createdAt) throw CustomError.badRequest('Falta la fecha');

        return new VisitRequestAuditEntity(
            id,
            action,
            before,
            after,
            user.name,
            createdAt
        );
    }
}