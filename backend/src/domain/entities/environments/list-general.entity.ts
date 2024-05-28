import { CustomError } from '../../errors/custom.error';

export class EnvironmentsListEntity {
    constructor(
        public id: number,
        public project: string,
        public client: string,
        public type: string,
        public des_status: 'PENDIENTE' | 'PROCESO' | 'PAUSADO' | 'FINALIZADO' | 'CANCELADO',
        public fab_status: 'PENDIENTE' | 'PROCESO' | 'PAUSADO' | 'FINALIZADO' | 'CANCELADO',
        public ins_status: 'PENDIENTE' | 'PROCESO' | 'PAUSADO' | 'FINALIZADO' | 'CANCELADO',
    ) { }

    static fromObject(object: { [key: string]: any }): EnvironmentsListEntity {
        const { id, project, type, des_status, fab_status, ins_status } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!type) throw CustomError.badRequest('Falta el tipo');
        if (!project) throw CustomError.badRequest('Falta el proyecto');
        if (!project.client) throw CustomError.badRequest('Falta el cliente');
        if (!des_status) throw CustomError.badRequest('Falta el estado de diseño');
        if (!fab_status) throw CustomError.badRequest('Falta el estado de fabricación');
        if (!ins_status) throw CustomError.badRequest('Falta el estado de instalación');

        return new EnvironmentsListEntity(
            id,
            project.title,
            project.client.last_name + ' ' + project.client.name,
            type.name,
            des_status,
            fab_status,
            ins_status,
        );

    }
}