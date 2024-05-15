import { CustomError } from '../../errors/custom.error';

export class ClientProjectEntity {
    constructor(
        public id: string,
        public title: string,
        public status: string,
        public priority: string,
        public locality: string,
    ) { }

    static fromObject(object: { [key: string]: any }): ClientProjectEntity {
        const { id, title, status, priority, locality, address, env_total, requested_deadline, estimated_deadline } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!status) throw CustomError.badRequest('Falta el estado del proyecto');
        if (!priority) throw CustomError.badRequest('Falta la prioridad del proyecto');
        if (!locality) throw CustomError.badRequest('Falta la localidad del proyecto');

        return new ClientProjectEntity(
            id,
            title,
            status,
            priority,
            locality.name,
        );
    }
}