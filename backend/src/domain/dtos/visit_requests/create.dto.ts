export class VisitRequestDTO {
    private constructor(
        public id_visit_reason: number,
        public status: 'PENDIENTE' | 'PAUSADA' | 'REALIZADA' | 'CANCELADA' = 'PENDIENTE',
        public priority: 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE' = 'MEDIA',
        public id_client: number,
        public id_locality: number,
        public address: string = '',

        public notes: string = '',
        public schedule: 'NOT_SCHEDULED' | 'PARTIAL_SCHEDULED' | 'FULL_SCHEDULED',
        public start: Date | null,
        public end: Date | null
    ) { }

    static create(object: { [key: string]: any }): [string?, VisitRequestDTO?] {
        const { id_visit_reason, status, priority, id_client, id_locality, address, notes, schedule, start, end } = object;

        if (!id_visit_reason) return ['El ID de motivo de visita es requerido'];
        if (!status) return ['El estado de la visita es requerido'];
        if (!priority) return ['La prioridad de la visita es requerida'];
        if (!id_client) return ['El ID de cliente es requerido'];
        if (!id_locality) return ['El ID de localidad es requerido'];

        // NOT_SCHEDULED -> start = null, end = null
        // PARTIAL_SCHEDULED -> start = DateX, end = DateX
        // FULL_SCHEDULED -> start = DateX, end = DateY 

        if (!schedule) return ['El tipo de horario de la visita es requerido'];
        let start_date: Date | null = null;
        let end_date: Date | null = null;

        switch (schedule) {
            case 'NOT_SCHEDULED':
                start_date = null;
                end_date = null;
                break;
            case 'PARTIAL_SCHEDULED':
                if (!start) return ['La fecha de inicio de la visita es requerida'];
                start_date = start;
                end_date = start;
                break;
            case 'FULL_SCHEDULED':
                if (!start) return ['La fecha de inicio de la visita es requerida'];
                if (!end) return ['La fecha de fin de la visita es requerida'];
                start_date = start;
                end_date = end;
                break;
            default:
                return ['El tipo de horario de la visita es inválido'];
        }

        return [undefined, new VisitRequestDTO(
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
        )];
    }
}