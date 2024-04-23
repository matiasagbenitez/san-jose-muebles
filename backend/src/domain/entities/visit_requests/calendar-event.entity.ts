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
            description: string,
            status: 'PENDIENTE' | 'REALIZADA' | 'CANCELADA',
            reason: string,
            reason_color: string,
        }
    ) { }

    static fromObject(object: { [key: string]: any }): CalendarEventEntity {
        const { id, title, start, end, priority, client, locality, address, description, status, reason } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!title) throw CustomError.badRequest('Falta el título');
        if (!start) throw CustomError.badRequest('Falta la fecha de inicio');
        if (!end) throw CustomError.badRequest('Falta la fecha de fin');
        if (!priority) throw CustomError.badRequest('Falta la prioridad');
        if (!client) throw CustomError.badRequest('Falta el cliente');
        if (!locality) throw CustomError.badRequest('Falta la localidad');
        if (!status) throw CustomError.badRequest('Falta el estado');
        if (!reason) throw CustomError.badRequest('Falta el motivo');

        const eventTitle = `${client.name} - ${reason.name}`;

        const resource = {
            priority: priority,
            client: client.name,
            phone: client.phone,
            locality: locality.name,
            address: address,
            description: description,
            status: status,
            reason: reason.name,
            reason_color: reason.color,
        };

        return new CalendarEventEntity(
            id,
            false,
            eventTitle,
            start,
            end,
            resource
        );
    }
}