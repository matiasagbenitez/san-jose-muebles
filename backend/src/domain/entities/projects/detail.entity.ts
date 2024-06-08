import { CustomError } from '../../errors/custom.error';

interface Environment {
    id: number;
    type: string;
    des_status: string;
    fab_status: string;
    ins_status: string;
}
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

        public requested_deadline: Date | null,
        public estimated_deadline: Date | null,

        public createdAt: Date,

        public environments: Environment[] = [],

    ) { }

    static fromObject(object: { [key: string]: any }): ProjectDetailEntity {

        const { id, title, status, priority, client, locality, address, requested_deadline, estimated_deadline, createdAt, environments } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!status) throw CustomError.badRequest('Falta el estado');
        if (!client) throw CustomError.badRequest('Falta el cliente');
        if (!locality) throw CustomError.badRequest('Falta la localidad');

        if (environments) {
            if (!Array.isArray(environments)) throw CustomError.badRequest('¡Ambientes no es un array!');
            environments.forEach((env: any) => {
                if (!env.id) throw CustomError.badRequest('¡Falta el ID del ambiente!');
                if (!env.type) throw CustomError.badRequest('¡Falta el tipo del ambiente!');
                // if (!env.status) throw CustomError.badRequest('¡Falta el estado del ambiente!');
            });
        }

        const envs: Environment[] = environments.map((env: any) => {
            return {
                id: env.id,
                type: env.type.name,
                des_status: env.design.status,
                fab_status: env.fabrication.status,
                ins_status: env.installation.status,
            }
        });

        return new ProjectDetailEntity(
            id,
            title,
            status,
            priority,
            client.id,
            client.name + ' ' + client.last_name,
            client.phone,
            locality.name,
            address,
            requested_deadline,
            estimated_deadline,
            createdAt,
            envs
        );
    }
}