import { CustomError } from '../../errors/custom.error';

interface ClientData {
    name: string;
    phone: string;
    locality: string;
}

export class VisitRequestDetailEntity {
    constructor(
        public id: number,
        public reason: string,
        public status: 'PENDIENTE' | 'REALIZADA' | 'CANCELADA',
        public priority: 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE',
        public overdue: boolean,
        public client: ClientData,
        public locality: string,
        public address: string,

        public notes: string,
        public schedule: 'NOT_SCHEDULED' | 'PARTIAL_SCHEDULED' | 'FULL_SCHEDULED',
        public start: Date | null,
        public end: Date | null,
        public createdAt: Date,
        public createdBy: string = 'Desconocido'
    ) { }

    static fromObject(object: { [key: string]: any }): VisitRequestDetailEntity {
        const { id, reason, status, priority, client, locality, address, notes, schedule, start, end, createdAt, user } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!reason) throw CustomError.badRequest('Falta el motivo');
        if (!status) throw CustomError.badRequest('Falta el estado');
        if (!priority) throw CustomError.badRequest('Falta la prioridad');
        if (!client) throw CustomError.badRequest('Falta el cliente');
        if (!locality) throw CustomError.badRequest('Falta la localidad');

        let overdue: boolean = false;
        if (start) overdue = new Date() > new Date(start);

        return new VisitRequestDetailEntity(
            id,
            reason.name,
            status,
            priority,
            overdue,
            {
                name: client.name,
                phone: client.phone,
                locality: client.locality.name,
            },
            locality.name,
            address,
            notes,
            schedule,
            start,
            end,
            createdAt,
            user.name
        );
    }
}