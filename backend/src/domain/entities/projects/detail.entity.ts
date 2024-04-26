import { CustomError } from '../../errors/custom.error';

export class ProjectDetailEntity {
    constructor(
        public id: number,
        public title: string,
        public status: "PENDIENTE" | "PROCESO" | "PAUSADO" | "FINALIZADO" | "CANCELADO",
        public priority: "BAJA" | "MEDIA" | "ALTA" | "URGENTE",

        public id_client: number,
        public client: string,
        public client_phone: string,
        public locality: string,
        public address: string,

        public env_total: number,
        public env_des: number,
        public env_fab: number,
        public env_ins: number,

        public requested_deadline: Date | null,
        public estimated_deadline: Date | null,

        public createdAt: Date,
    ) { }

    static fromObject(object: { [key: string]: any }): ProjectDetailEntity {

        const { id, title, status, priority, client, locality, address, env_total, env_des, env_fab, env_ins, requested_deadline, estimated_deadline, createdAt } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!status) throw CustomError.badRequest('Falta el estado');
        if (!client) throw CustomError.badRequest('Falta el cliente');
        if (!locality) throw CustomError.badRequest('Falta la localidad');

        return new ProjectDetailEntity(
            id,
            title,
            status,
            priority,
            client.id,
            client.name,
            client.phone,
            locality.name,
            address,
            env_total,
            env_des,
            env_fab,
            env_ins,
            requested_deadline,
            estimated_deadline,
            createdAt,
        );
    }
}