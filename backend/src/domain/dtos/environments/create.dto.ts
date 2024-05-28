export class CreateEnvironmentDTO {
    private constructor(
        public id_project: number,
        public id_type_of_environment: number,
        public difficulty: 'BAJA' | 'MEDIA' | 'ALTA' = 'BAJA',
        public priority: 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE' = 'BAJA',
        public description: string,
        public req_deadline: Date | null,
        public est_deadline: Date | null,
        public des_status: 'PENDIENTE' | 'PROCESO' | 'PAUSADO' | 'PRESENTADO' | 'CAMBIOS' | 'FINALIZADO' | 'CANCELADO' = 'PENDIENTE',
        public fab_status: 'PENDIENTE' | 'PROCESO' | 'PAUSADO' | 'FINALIZADO' | 'CANCELADO' = 'PENDIENTE',
        public ins_status: 'PENDIENTE' | 'PROCESO' | 'PAUSADO' | 'FINALIZADO' | 'CANCELADO' = 'PENDIENTE',
    ) { }

    static create(object: { [key: string]: any }): [string?, CreateEnvironmentDTO?] {
        const { id_project, id_type_of_environment, difficulty, priority, description, req_deadline, est_deadline } = object;

        if (!id_project) return ['Falta el ID del proyecto'];
        if (!id_type_of_environment) return ['Falta el ID del tipo de ambiente'];
        if (!description) return ['Falta la descripción'];
        if (!difficulty) return ['Falta la dificultad'];
        if (!priority) return ['Falta la prioridad'];

        return [undefined, new CreateEnvironmentDTO(
            id_project,
            id_type_of_environment,
            difficulty,
            priority,
            description,
            typeof req_deadline === 'string' ? new Date(req_deadline) : req_deadline || null,
            typeof est_deadline === 'string' ? new Date(est_deadline) : est_deadline || null,
        )];
    }
}