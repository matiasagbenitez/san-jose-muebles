import { CustomError } from '../../errors/custom.error';

interface Project {
    id: string,
    title: string,
    client: string,
}

interface Evolution {
    id: string;
    status: 'PENDIENTE' | 'PROCESO' | 'PAUSADO' | 'FINALIZADO' | 'CANCELADO';
    comment: string;
    user: string;
    createdAt: Date;
}

export class ProjectEvolutionsEntity {
    constructor(
        public project: Project,
        public evolutions: Evolution[]
    ) { }

    static fromObject(object: { [key: string]: any }): ProjectEvolutionsEntity {
        const { id, title, client, evolutions } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!title) throw CustomError.badRequest('Falta el título');
        if (!client) throw CustomError.badRequest('Falta el cliente');

        const { name, last_name } = client;

        const evolutionsArray = evolutions.map((evolution: any) => ({
            id: evolution.id,
            status: evolution.status,
            comment: evolution.comment,
            user: evolution.user.name,
            createdAt: evolution.createdAt,
        }));

        return new ProjectEvolutionsEntity(
            { id, title: title, client: `${name} ${last_name}` },
            evolutionsArray
        );
    }
}