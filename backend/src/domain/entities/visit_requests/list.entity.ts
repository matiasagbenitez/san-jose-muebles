import { CustomError } from '../../errors/custom.error';

export class VisitRequestListEntity {
    constructor(
        public id: number,
        public schedule: 'NOT_SCHEDULED' | 'PARTIAL_SCHEDULED' | 'FULL_SCHEDULED',
        public start: Date | null,
        public status: 'PENDIENTE' | 'REALIZADA' | 'CANCELADA',
        public client: string,
        public locality: string,
        public reason: string,
        public priority: 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE',
        public overdue: boolean = false
    ) { }

    static fromObject(object: { [key: string]: any }): VisitRequestListEntity {

        const { id, schedule, start, status, client, locality, reason, priority } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!status) throw CustomError.badRequest('Falta el estado');
        if (!client) throw CustomError.badRequest('Falta el cliente');
        if (!locality) throw CustomError.badRequest('Falta la localidad');
        if (!reason) throw CustomError.badRequest('Falta el motivo');
        if (!priority) throw CustomError.badRequest('Falta la prioridad');

        let overdue = false;
        if (schedule === 'FULL_SCHEDULED' || schedule === 'PARTIAL_SCHEDULED') {
            if (start) {
                const now = new Date();
                const startDate = new Date(start);
                overdue = startDate < now;
            }
        }

        return new VisitRequestListEntity(
            id,
            schedule,
            start,
            status,
            client.last_name + ' ' + client.name,
            locality.name,
            reason.name,
            priority,
            overdue
        );
    }
}