import { CustomError } from '../../errors/custom.error';

export class ProjectListableEntity {
    constructor(
        public id: number,
        public title: string,
        public status: "PENDIENTE" | "PROCESO" | "PAUSADO" | "FINALIZADO" | "CANCELADO",
        public priority: "BAJA" | "MEDIA" | "ALTA" | "URGENTE",
        public client: string,
        public locality: string,
        public requested_deadline: Date | null,
        public createdAt: Date,
    ) { }

    static fromObject(object: { [key: string]: any }): ProjectListableEntity {

        const { id, title, status, priority, client, locality, requested_deadline, createdAt} = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!status) throw CustomError.badRequest('Falta el estado');
        if (!client) throw CustomError.badRequest('Falta el cliente');
        if (!locality) throw CustomError.badRequest('Falta la localidad');

        return new ProjectListableEntity(
            id,
            title,
            status,
            priority,
            client.name,
            locality.name,
            requested_deadline,
            createdAt,
        );
    }
}