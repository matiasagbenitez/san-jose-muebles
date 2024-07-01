import { CustomError } from '../../errors/custom.error';

export class DesignBasicEntity {

    constructor(
        public id: string,
        public status: string,
        public type: string,
        public description: string,
        public project: string,
        public client: string,
    ) { }

    static fromObject(object: { [key: string]: any }): DesignBasicEntity {
        const { id, environment, status } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!environment) throw CustomError.badRequest('Falta el ambiente');
        if (!status) throw CustomError.badRequest('Falta el estado');

        const { type, project, description } = environment;
        const { name, last_name } = environment.project.client;

        return new DesignBasicEntity(
            id,
            status,
            type.name,
            description,
            project.title,
            `${name} ${last_name}`,
        );
    }
}