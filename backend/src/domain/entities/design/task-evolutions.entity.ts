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
    status: 'PENDIENTE' | 'PROCESO' | 'FINALIZADO' | 'CANCELADO';
    comment: string;
    user: string;
    createdAt: Date;
}

interface Task {
    id: string;
    title: string;
    description: string;
    status: string;
    user: string;
    createdAt: Date;
    evolutions: Evolution[];
}


export class DesignTaskEvolutionsEntity {
    constructor(
        public design: Design,
        public task: Task,
    ) { }

    static fromObject(object: { [key: string]: any }): DesignTaskEvolutionsEntity {
        const { id, environment, status, tasks } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!environment) throw CustomError.badRequest('Falta el ambiente');
        if (!status) throw CustomError.badRequest('Falta el estado');
        if (!tasks) throw CustomError.badRequest('Falta la tarea');

        const { type, project, description } = environment;
        const { name, last_name } = environment.project.client;

        const [task] = tasks;

        const evolutionsArray = task.evolutions.map((evolution: any) => ({
            id: evolution.id,
            status: evolution.status,
            comment: evolution.comment,
            user: evolution.user.name,
            createdAt: evolution.createdAt,
        }));

        return new DesignTaskEvolutionsEntity(
            { id, type: type.name, project: project.title, client: `${name} ${last_name}`, description, status },
            {
                id: task.id,
                title: task.title,
                description: task.description,
                status: task.status,
                user: task.user.name,
                createdAt: task.createdAt,
                evolutions: evolutionsArray
            }
        );
    }
}