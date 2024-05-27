import { CustomError } from '../../errors/custom.error';

export class EnvironmentsByProjectEntity {
    constructor(
        public id: number,
        public type: string,
        public description: string,
        public status: 'PENDIENTE' | 'PROCESO' | 'PAUSADO' | 'FINALIZADO' | 'CANCELADO',
        public req_deadline: Date | null,
        public est_deadline: Date | null,
        public des_status: 'PENDIENTE' | 'PROCESO' | 'PAUSADO' | 'FINALIZADO' | 'CANCELADO',
        public fab_status: 'PENDIENTE' | 'PROCESO' | 'PAUSADO' | 'FINALIZADO' | 'CANCELADO',
        public ins_status: 'PENDIENTE' | 'PROCESO' | 'PAUSADO' | 'FINALIZADO' | 'CANCELADO',
        public created_at: Date,
    ) { }

    static fromObject(object: { [key: string]: any }): EnvironmentsByProjectEntity {
        const { id, type, description, status, req_deadline, est_deadline, des_status, fab_status, ins_status, createdAt } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!type) throw CustomError.badRequest('Falta el tipo');
        if (!description) throw CustomError.badRequest('Falta la descripción');
        if (!status) throw CustomError.badRequest('Falta el estado');
        if (!des_status) throw CustomError.badRequest('Falta el estado de diseño');
        if (!fab_status) throw CustomError.badRequest('Falta el estado de fabricación');
        if (!ins_status) throw CustomError.badRequest('Falta el estado de instalación');
        if (!createdAt) throw CustomError.badRequest('Falta la fecha de creación');

        return new EnvironmentsByProjectEntity(
            id,
            type.name,
            description,
            status,
            req_deadline,
            est_deadline,
            des_status,
            fab_status,
            ins_status,
            createdAt,
        );

    }
}