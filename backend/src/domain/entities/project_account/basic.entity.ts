import { CustomError } from '../../errors/custom.error';

export class ProjectBasicEntity {
    constructor(
        public id: string,
        public title: string,
        public client: string,
        public locality: string,
        public status: 'PENDIENTE' | 'PAUSADO' | 'PROCESO' | 'FINALIZADO' | 'CANCELADO',
    ) { }

    static fromObject(object: { [key: string]: any }): ProjectBasicEntity {
        const { id, title, client, locality, status } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!client) throw CustomError.badRequest('Falta el cliente');
        if (!locality) throw CustomError.badRequest('Falta la localidad');
        if (!status) throw CustomError.badRequest('Falta el estado');

        return new ProjectBasicEntity(
            id,
            title,
            client.name + ' ' + client.last_name,
            locality.name,
            status
        );
    }
}