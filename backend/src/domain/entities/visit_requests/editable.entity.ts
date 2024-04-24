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

        public notes: string,
        public schedule: 'NOT_SCHEDULED' | 'PARTIAL_SCHEDULED' | 'FULL_SCHEDULED',
        public start: Date | null,
        public end: Date | null
    ) { }

    static fromObject(object: { [key: string]: any }): VisitRequestEditableEntity {
        const { id, id_visit_reason, status, priority, id_client, id_locality, address, notes, schedule, start, end } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!id_visit_reason) throw CustomError.badRequest('Falta el motivo de visita');
        if (!status) throw CustomError.badRequest('Falta el estado');
        if (!priority) throw CustomError.badRequest('Falta la prioridad');
        if (!id_client) throw CustomError.badRequest('Falta el cliente');
        if (!id_locality) throw CustomError.badRequest('Falta la localidad');

        // NOT_SCHEDULED -> start = null, end = null
        // PARTIAL_SCHEDULED -> start = DateX, end = DateX
        // FULL_SCHEDULED -> start = DateX, end = DateY

        if (!schedule) throw CustomError.badRequest('Falta el tipo de horario');
        let start_date: Date | null = null;
        let end_date: Date | null = null;

        switch (schedule) {
            case 'NOT_SCHEDULED':
                start_date = null;
                end_date = null;
                break;
            case 'PARTIAL_SCHEDULED':
                if (!start) throw CustomError.badRequest('Falta la fecha de inicio');
                start_date = new Date(start);
                end_date = new Date(start);
                break;
            case 'FULL_SCHEDULED':
                if (!start) throw CustomError.badRequest('Falta la fecha de inicio');
                if (!end) throw CustomError.badRequest('Falta la fecha de fin');
                start_date = new Date(start);
                end_date = new Date(end);
                break;
            default:
                throw CustomError.badRequest('Tipo de horario inválido');
        }

        return new VisitRequestEditableEntity(
            id,
            id_visit_reason,
            status,
            priority,
            id_client,
            id_locality,
            address,
            notes,
            schedule,
            start_date,
            end_date
        );
    }
}