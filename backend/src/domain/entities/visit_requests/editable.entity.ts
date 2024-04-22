import { CustomError } from '../../errors/custom.error';


export class VisitRequestEditableEntity {
    constructor(
        public id: number,
        public id_visit_reason: string,
        public status: 'PENDIENTE' | 'REALIZADA' | 'CANCELADA',
        public priority: 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE',
        public id_client: string,
        public id_locality: string,
        public address: string,
        public title: string,
        public description: string,
        public start: string,
        public end: string,
    ) { }

    static fromObject(object: { [key: string]: any }): VisitRequestEditableEntity {
        const { id, id_visit_reason, status, priority, id_client, id_locality, address, title, description, start, end } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!id_visit_reason) throw CustomError.badRequest('Falta el motivo de la visita');
        if (!status) throw CustomError.badRequest('Falta el estado de la visita');
        if (!priority) throw CustomError.badRequest('Falta la prioridad de la visita');
        if (!id_client) throw CustomError.badRequest('Falta el cliente de la visita');
        if (!id_locality) throw CustomError.badRequest('Falta la localidad de la visita');
        if (!title) throw CustomError.badRequest('Falta el título de la visita');
        if (!start) throw CustomError.badRequest('Falta la fecha de inicio de la visita');
        if (!end) throw CustomError.badRequest('Falta la fecha de fin de la visita');

        return new VisitRequestEditableEntity(
            id,
            id_visit_reason,
            status,
            priority,
            id_client,
            id_locality,
            address,
            title,
            description,
            new Date(start).toISOString().slice(0, 16),
            new Date(end).toISOString().slice(0, 16),
        );
    }
}