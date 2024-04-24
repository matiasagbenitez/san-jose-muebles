import { CustomError } from '../../errors/custom.error';

export class VisitRequestListEntity {
    constructor(
        public id: number,
        public start: Date | null,
        public status: 'PENDIENTE' | 'REALIZADA' | 'CANCELADA',
        public client: string,
        public locality: string,
        public reason: string,
        public priority: 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE',
    ) { }

    static fromObject(object: { [key: string]: any }): VisitRequestListEntity {

        const { id, start, status, client, locality, reason, priority } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!status) throw CustomError.badRequest('Falta el estado');
        if (!client) throw CustomError.badRequest('Falta el cliente');
        if (!locality) throw CustomError.badRequest('Falta la localidad');
        if (!reason) throw CustomError.badRequest('Falta el motivo');
        if (!priority) throw CustomError.badRequest('Falta la prioridad');

        return new VisitRequestListEntity(
            id,
            start,
            status,
            client.name,
            locality.name,
            reason.name,
            priority
        );
    }
}