import { CustomError } from '../../errors/custom.error';

export class EnvironmentDetailEntity {
    constructor(
        public id: number,

        public id_project: number,
        public project: string,

        public id_client: number,
        public client: string,
        public client_phone: string,

        public type: string,

        public difficulty: 'BAJA' | 'MEDIA' | 'ALTA',
        public priority: 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE',
        public description: string,

        public des_id: number,
        public des_status: 'PROCESO' | 'PENDIENTE' | 'PAUSADO' | 'PRESENTAR' | 'PRESENTADO' | 'REVISION' | 'FINALIZADO' | 'CANCELADO',
        public des_last_update: Date | null,

        public fab_id: number,
        public fab_status: 'PROCESO' | 'PENDIENTE' | 'PAUSADO' | 'FINALIZADO' | 'CANCELADO',
        public fab_last_update: Date | null,

        public ins_id: number,
        public ins_status: 'PROCESO' | 'PENDIENTE' | 'PAUSADO' | 'FINALIZADO' | 'CANCELADO',
        public ins_last_update: Date | null,

        public req_deadline: Date | null,
        public est_deadline: Date | null,
    ) { }

    static fromObject(object: { [key: string]: any }): EnvironmentDetailEntity {
        const { id, project, type, difficulty, priority, description, design, fabrication, installation, req_deadline, est_deadline } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!type) throw CustomError.badRequest('Falta el tipo');
        if (!project) throw CustomError.badRequest('Falta el proyecto');
        if (!project.client) throw CustomError.badRequest('Falta el cliente');
        if (!design.status) throw CustomError.badRequest('Falta el estado de diseño');
        if (!fabrication.status) throw CustomError.badRequest('Falta el estado de fabricación');
        if (!installation.status) throw CustomError.badRequest('Falta el estado de instalación');

        return new EnvironmentDetailEntity(
            id,
            project.id,
            project.title,
            project.client.id,
            project.client.name + ' ' + project.client.last_name,
            project.client.phone,
            type.name,
            difficulty,
            priority,
            description,
            design.id,
            design.status,
            design.updatedAt,
            fabrication.id,
            fabrication.status,
            fabrication.updatedAt,
            installation.id,
            installation.status,
            installation.updatedAt,
            req_deadline,
            est_deadline
        );

    }
}