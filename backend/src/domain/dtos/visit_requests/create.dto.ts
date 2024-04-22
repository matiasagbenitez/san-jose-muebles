export class VisitRequestDTO {
    private constructor(
        public id_visit_reason: number,
        public visible_for: 'ALL' | 'ADMIN' = 'ALL',
        public status: 'PENDIENTE' | 'REALIZADA' | 'CANCELADA' = 'PENDIENTE',
        public priority: 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE' = 'BAJA',
        public id_client: number,
        public id_locality: number,
        public address: string,

        public title: string,
        public description: string,
        public start: Date,
        public end: Date,

        public id_user: number,
    ) { }

    static create(object: { [key: string]: any }): [string?, VisitRequestDTO?] {
        const { id_visit_reason, visible_for, status, priority, id_client, id_locality, address, title, description, start, end, id_user } = object;

        if (!id_visit_reason) return ['El ID de motivo de visita es requerido'];
        if (!id_client) return ['El ID de cliente es requerido'];
        if (!id_locality) return ['El ID de localidad es requerido'];
        if (!title) return ['El título es requerido'];
        if (!start) return ['La fecha de inicio es requerida'];
        if (!end) return ['La fecha de fin es requerida'];
        if (!id_user) return ['El ID de usuario es requerido'];

        return [undefined, new VisitRequestDTO(
            id_visit_reason, visible_for, status, priority, id_client, id_locality, address, title, description, start, end, id_user
        )];
    }
}