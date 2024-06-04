export class CreateProjectDTO {
    private constructor(
        public readonly id_client: number,                                                                              // FORM
        public readonly title: string = '',                                                                             // FORM
        public readonly status: "PENDIENTE" | "PROCESO" | "PAUSADO" | "FINALIZADO" | "CANCELADO" = "PENDIENTE",
        public readonly priority: "BAJA" | "MEDIA" | "ALTA" | "URGENTE" = "MEDIA",                                      // FORM
        public readonly id_locality: number,                                                                            // FORM
        public readonly address: string,                                                                                // FORM
        public readonly requested_deadline: Date,                                                                       // FORM
        public readonly estimated_deadline: Date,                                                                       // FORM
    ) { }

    static create(object: { [key: string]: any }): [string?, CreateProjectDTO?] {
        const { id_client, title, status, priority, id_locality, address, requested_deadline, estimated_deadline } = object;

        if (!id_client) return ['El ID del cliente es requerido'];
        if (!title) return ['El título es requerido'];
        if (!priority) return ['La prioridad es requerida'];
        if (!id_locality) return ['La localidad es requerida'];

        return [undefined, new CreateProjectDTO(
            id_client,
            title,
            status,
            priority,
            id_locality,
            address,
            requested_deadline,
            estimated_deadline
        )];
    }
}