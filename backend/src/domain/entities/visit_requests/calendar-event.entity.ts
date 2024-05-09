import { CustomError } from '../../errors/custom.error';

export class CalendarEventEntity {
    constructor(
        public id: number,
        public allDay: boolean,
        public title: string,
        public start: Date,
        public end: Date,
        public resource: {
            id: number,
            priority: 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE',
            client: string,
            phone: string,
            locality: string,
            address: string,
            notes: string,
            reason: string,
            schedule: 'FULL_SCHEDULED' | 'PARTIAL_SCHEDULED' | 'NOT_SCHEDULED'
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
        const client_full_name = client.name + ' ' + client.last_name;

        const eventTitle = `${client_full_name} - ${reason.name}`;


        const resource = {
            id: id,
            priority: priority,
            client: client_full_name,
            phone: client.phone,
            locality: locality.name,
            address: address,
            notes: notes,
            reason: reason.name,
            schedule: schedule,
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