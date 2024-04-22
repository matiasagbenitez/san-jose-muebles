import { CustomError } from '../../errors/custom.error';

export class VisitRequestListEntity {
    constructor(
        public id: number,
        public reason: string,
        public reason_color: string,
        public status: 'PENDIENTE' | 'REALIZADA' | 'CANCELADA',
        public priority: 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE',
        public client: string,
        public locality: string,
        public title: string,
        public start: Date,
        public end: Date,
    ) { }

    static fromObject(object: { [key: string]: any }): VisitRequestListEntity {
        const { id, reason, status, priority, client, locality, title, start, end } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!reason) throw CustomError.badRequest('Falta el motivo');
        if (!status) throw CustomError.badRequest('Falta el estado');
        if (!priority) throw CustomError.badRequest('Falta la prioridad');
        if (!client) throw CustomError.badRequest('Falta el cliente');
        if (!locality) throw CustomError.badRequest('Falta la localidad');
        if (!title) throw CustomError.badRequest('Falta el título');
        if (!start) throw CustomError.badRequest('Falta la fecha de inicio');
        if (!end) throw CustomError.badRequest('Falta la fecha de fin');

        return new VisitRequestListEntity(
            id, 
            reason.name,
            reason.color,
            status, 
            priority, 
            client.name,
            locality.name,
            title, 
            start, 
            end
        );
    }
}