export class CreateEnvironmentDTO {
    private constructor(
        public id_project: number,
        public id_type_of_environment: number,
        public status: 'PENDIENTE' | 'PROCESO' | 'PAUSADO' | 'FINALIZADO' | 'CANCELADO' = 'PENDIENTE',
        public description: string,
        public req_deadline: Date | null,
        public est_deadline: Date | null,
        public des_status: 'PENDIENTE' | 'PROCESO' | 'PAUSADO' | 'PRESENTADO' | 'MODIFICANDO' | 'FINALIZADO' | 'CANCELADO' = 'PENDIENTE',
        public fab_status: 'PENDIENTE' | 'PROCESO' | 'PAUSADO' | 'FINALIZADO' | 'CANCELADO' = 'PENDIENTE',
        public ins_status: 'PENDIENTE' | 'PROCESO' | 'PAUSADO' | 'FINALIZADO' | 'CANCELADO' = 'PENDIENTE',
    ) { }

    static create(object: { [key: string]: any }): [string?, CreateEnvironmentDTO?] {
        const { id_project, id_type_of_environment, status, description, req_deadline, est_deadline } = object;

        if (!id_project) return ['Falta el ID del proyecto'];
        if (!id_type_of_environment) return ['Falta el ID del tipo de ambiente'];
        if (!status) return ['Falta el estado'];
        if (!description) return ['Falta la descripción'];

        return [undefined, new CreateEnvironmentDTO(
            id_project,
            id_type_of_environment,
            status,
            description,
            req_deadline || null,
            est_deadline || null,
        )];
    }
}