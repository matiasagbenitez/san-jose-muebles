import { CustomError } from '../../errors/custom.error';

export class EnvironmentsListEntity {
    constructor(
        public id: number,
        public status: 'PROCESO' | 'PENDIENTE' | 'PAUSADO' | 'FINALIZADO' | 'CANCELADO',
        public project: string,
        public client: string,
        public type: string,
        public difficulty: 'BAJA' | 'MEDIA' | 'ALTA',
        public priority: 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE',
        public des_status: 'PENDIENTE' | 'PROCESO' | 'PAUSADO' | 'PRESENTADO' | 'CAMBIOS' | 'FINALIZADO' | 'CANCELADO',
        public fab_status: 'PENDIENTE' | 'PROCESO' | 'PAUSADO' | 'FINALIZADO' | 'CANCELADO',
        public ins_status: 'PENDIENTE' | 'PROCESO' | 'PAUSADO' | 'FINALIZADO' | 'CANCELADO',
        public req_deadline: Date | null,
        public est_deadline: Date | null,
    ) { }

    static fromObject(object: { [key: string]: any }): EnvironmentsListEntity {
        const { id, status, project, type, difficulty, priority, design, fabrication, installation, req_deadline, est_deadline } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!status) throw CustomError.badRequest('Falta el estado');
        if (!type) throw CustomError.badRequest('Falta el tipo');
        if (!project) throw CustomError.badRequest('Falta el proyecto');
        if (!project.client) throw CustomError.badRequest('Falta el cliente');
        if (!design.status) throw CustomError.badRequest('Falta el estado de diseño');
        if (!fabrication.status) throw CustomError.badRequest('Falta el estado de fabricación');
        if (!installation.status) throw CustomError.badRequest('Falta el estado de instalación');

        return new EnvironmentsListEntity(
            id,
            status,
            project.title,
            project.client.last_name + ' ' + project.client.name,
            type.name,
            difficulty,
            priority,
            design.status,
            fabrication.status,
            installation.status,
            req_deadline,
            est_deadline,
        );

    }
}