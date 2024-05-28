import { CustomError } from '../../errors/custom.error';

export class EnvironmentsByProjectEntity {
    constructor(
        public id: number,
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
        const { id, type, description, req_deadline, est_deadline, difficulty, priority, des_status, fab_status, ins_status } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!type) throw CustomError.badRequest('Falta el tipo');
        if (!description) throw CustomError.badRequest('Falta la descripción');
        if (!des_status) throw CustomError.badRequest('Falta el estado de diseño');
        if (!fab_status) throw CustomError.badRequest('Falta el estado de fabricación');
        if (!ins_status) throw CustomError.badRequest('Falta el estado de instalación');

        return new EnvironmentsByProjectEntity(
            id,
            type.name,
            difficulty,
            priority,
            description,
            req_deadline,
            est_deadline,
            des_status,
            fab_status,
            ins_status,
        );

    }
}