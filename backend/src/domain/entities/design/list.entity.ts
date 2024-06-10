import { CustomError } from '../../errors/custom.error';

type DesignStatus = 'PENDIENTE' | 'PROCESO' | 'PAUSADO' | 'PRESENTAR' | 'PRESENTADO' | 'REVISION' | 'FINALIZADO' | 'CANCELADO';

export class DesignListEntity {
    constructor(
        public id: string,
        public environment: string,
        public project: string,
        public client: string,
        public status: DesignStatus,
        public createdAt: Date,
        public updatedAt: Date,
    ) { }

    static fromObject(object: { [key: string]: any }): DesignListEntity {
        const { id, environment, status } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!environment) throw CustomError.badRequest('Falta el ambiente');
        if (!environment.project) throw CustomError.badRequest('Falta el proyecto');
        if (!environment.project.client) throw CustomError.badRequest('Falta el proyecto');
        if (!status) throw CustomError.badRequest('Falta el estado');

        const { type, project } = environment;
        const { name, last_name } = environment.project.client;

        return new DesignListEntity(
            id,
            type.name,
            project.title,
            `${name} ${last_name}`,
            status,
            object.createdAt,
            object.updatedAt,
        );
    }
}