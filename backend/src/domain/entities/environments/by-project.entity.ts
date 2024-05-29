import { CustomError } from '../../errors/custom.error';

export class EnvironmentsByProjectEntity {
    constructor(
        public id: number,
        public status: 'PROCESO' | 'PENDIENTE' | 'PAUSADO' | 'FINALIZADO' | 'CANCELADO',
        public type: string,
        public difficulty: 'BAJA' | 'MEDIA' | 'ALTA', // 'BAJA' | 'MEDIA' | 'ALTA'
        public priority: 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE', // 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE'
        public description: string,
        public req_deadline: Date | null,
        public est_deadline: Date | null,
        public des_status: 'PENDIENTE' | 'PROCESO' | 'PAUSADO' | 'PRESENTADO' | 'CAMBIOS' | 'FINALIZADO' | 'CANCELADO',
        public fab_status: 'PENDIENTE' | 'PROCESO' | 'PAUSADO' | 'FINALIZADO' | 'CANCELADO',
        public ins_status: 'PENDIENTE' | 'PROCESO' | 'PAUSADO' | 'FINALIZADO' | 'CANCELADO',
    ) { }

    static fromObject(object: { [key: string]: any }): EnvironmentsByProjectEntity {
        const { id, status, type, description, req_deadline, est_deadline, difficulty, priority, design, fabrication, installation } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!status) throw CustomError.badRequest('Falta el estado');
        if (!type) throw CustomError.badRequest('Falta el tipo');
        if (!description) throw CustomError.badRequest('Falta la descripción');
        if (!design.status) throw CustomError.badRequest('Falta el estado de diseño');
        if (!fabrication.status) throw CustomError.badRequest('Falta el estado de fabricación');
        if (!installation.status) throw CustomError.badRequest('Falta el estado de instalación');

        return new EnvironmentsByProjectEntity(
            id,
            status,
            type.name,
            difficulty,
            priority,
            description,
            req_deadline,
            est_deadline,
            design.status,
            fabrication.status,
            installation.status,
        );

    }
}