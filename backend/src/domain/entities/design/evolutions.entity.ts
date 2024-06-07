import { CustomError } from '../../errors/custom.error';

interface Design {
    id: string,
    type: string,
    project: string,
    client: string,
    description: string,
    status: string,
}

interface Evolution {
    id: string;
    status: 'PENDIENTE' | 'PROCESO' | 'PAUSADO' | 'PRESENTADO' | 'REVISION' | 'FINALIZADO' | 'CANCELADO';
    comment: string;
    user: string;
    createdAt: Date;
}

export class DesignEvolutionsEntity {
    constructor(
        public design: Design,
        public evolutions: Evolution[]
    ) { }

    static fromObject(object: { [key: string]: any }): DesignEvolutionsEntity {
        const { id, environment, status, evolutions } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!environment) throw CustomError.badRequest('Falta el ambiente');
        if (!status) throw CustomError.badRequest('Falta el estado');

        const { type, project, description } = environment;
        const { name, last_name } = environment.project.client;

        const evolutionsArray = evolutions.map((evolution: any) => ({
            id: evolution.id,
            status: evolution.status,
            comment: evolution.comment,
            user: evolution.user.name,
            createdAt: evolution.createdAt,
        }));

        return new DesignEvolutionsEntity(
            { id, type: type.name, project: project.title, client: `${name} ${last_name}`, description, status },
            evolutionsArray
        );
    }
}