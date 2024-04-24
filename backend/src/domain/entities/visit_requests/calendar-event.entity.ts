import { CustomError } from '../../errors/custom.error';

export class CalendarEventEntity {
    constructor(
        public id: number,
        public allDay: boolean,
        public title: string,
        public start: Date,
        public end: Date,
        public resource: {
            priority: 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE',
            client: string,
            phone: string,
            locality: string,
            address: string,
            notes: string,
            status: 'PENDIENTE' | 'REALIZADA' | 'CANCELADA',
            reason: string,
            reason_color: string,
        }
    ) { }

    static fromObject(object: { [key: string]: any }): CalendarEventEntity {
        const { id, reason, status, priority, client, locality, address, notes, schedule, start, end } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!reason) throw CustomError.badRequest('Falta el motivo');
        if (!status) throw CustomError.badRequest('Falta el estado');
        if (!priority) throw CustomError.badRequest('Falta la prioridad');
        if (!client) throw CustomError.badRequest('Falta el cliente');
        if (!locality) throw CustomError.badRequest('Falta la localidad');

        let allDay: boolean = false;
        if (schedule === 'PARTIAL_SCHEDULED') allDay = true;

        const eventTitle = `${client.name} - ${reason.name}`;

        const resource = {
            priority: priority,
            client: client.name,
            phone: client.phone,
            locality: locality.name,
            address: address,
            notes: notes,
            status: status,
            reason: reason.name,
            reason_color: reason.color,
        };

        return new CalendarEventEntity(
            id,
            allDay,
            eventTitle,
            start,
            end,
            resource
        );
    }
}