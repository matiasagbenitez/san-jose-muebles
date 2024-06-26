import { CustomError } from '../../errors/custom.error';

interface ClientData {
    name: string;
    phone: string;
    locality: string;
}

interface Evolution {
    id: number;
    status: 'PENDIENTE' | 'PAUSADA' | 'REALIZADA' | 'CANCELADA';
    user: string;
    createdAt: Date;
}
export class VisitRequestDetailEntity {
    constructor(
        public id: number,
        public reason: string,
        public status: 'PENDIENTE' | 'PAUSADA' | 'REALIZADA' | 'CANCELADA',
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
        public createdBy: string = 'Desconocido',

        public evolutions: Evolution[] = [],
    ) { }

    static fromObject(object: { [key: string]: any }): VisitRequestDetailEntity {
        const { id, reason, status, priority, client, locality, address, notes, schedule, start, end, createdAt, user, evolutions } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!reason) throw CustomError.badRequest('Falta el motivo');
        if (!status) throw CustomError.badRequest('Falta el estado');
        if (!priority) throw CustomError.badRequest('Falta la prioridad');
        if (!client) throw CustomError.badRequest('Falta el cliente');
        if (!locality) throw CustomError.badRequest('Falta la localidad');

        const evolutionsArray: Evolution[] = evolutions.map((evolution: any) => {
            return {
                id: evolution.id,
                status: evolution.status,
                comment: evolution.comment,
                user: evolution.user.name,
                createdAt: evolution.createdAt,
            }
        });

        let overdue: boolean = false;
        if (start) overdue = new Date() > new Date(start);

        return new VisitRequestDetailEntity(
            id,
            reason.name,
            status,
            priority,
            overdue,
            {
                name: client.name + ' ' + client.last_name,
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
            user.name,
            evolutionsArray,
        );
    }
}