import { CustomError } from '../../errors/custom.error';

export class ProjectBasicDataEntity {
    constructor(
        public id: number,
        public title: string,
        public status: "PENDIENTE" | "PROCESO" | "PAUSADO" | "FINALIZADO" | "CANCELADO",
        public client: string,
        public locality: string,
    ) { }

    static fromObject(object: { [key: string]: any }): ProjectBasicDataEntity {

        const { id, title, status, client, locality } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!status) throw CustomError.badRequest('Falta el estado');
        if (!client) throw CustomError.badRequest('Falta el cliente');
        if (!locality) throw CustomError.badRequest('Falta la localidad');

        return new ProjectBasicDataEntity(
            id,
            title,
            status,
            client.name + ' ' + client.last_name,
            locality.name,
        );
    }
}