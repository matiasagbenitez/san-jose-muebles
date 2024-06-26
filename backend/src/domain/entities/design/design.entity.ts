import { CustomError } from '../../errors/custom.error';

interface Design {
    id: string,
    type: string,
    project: string,
    client: string,
    description: string,
    status: string,
}

interface Task {
    id: string;
    status: 'PENDIENTE' | 'PROCESO' | 'FINALIZADA' | 'ARCHIVADA';
    title: string;
    description: string;
    user: string;
    createdAt: Date;
}

export class DesignEntity {
    constructor(
        public design: Design,
        public tasks: {
            pending_tasks: Task[],
            process_tasks: Task[],
            finished_tasks: Task[],
            archived_tasks: Task[],
        }
    ) { }

    static fromObject(object: { [key: string]: any }): DesignEntity {
        const { id, environment, status, tasks } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!environment) throw CustomError.badRequest('Falta el ambiente');
        if (!status) throw CustomError.badRequest('Falta el estado');

        const pending_tasks = tasks.filter((task: Task) => task.status === 'PENDIENTE');
        const process_tasks = tasks.filter((task: Task) => task.status === 'PROCESO');
        const finished_tasks = tasks.filter((task: Task) => task.status === 'FINALIZADA');
        const archived_tasks = tasks.filter((task: Task) => task.status === 'ARCHIVADA');

        const formatted_pending_tasks = pending_tasks.map((task: any) => ({
            id: task.id,
            status: task.status,
            title: task.title,
            description: task.description,
            user: task.user.name,
            createdAt: task.createdAt,
        }));

        const formatted_process_tasks = process_tasks.map((task: any) => ({
            id: task.id,
            status: task.status,
            title: task.title,
            description: task.description,
            user: task.user.name,
            createdAt: task.createdAt,
        }));

        const formatted_finished_tasks = finished_tasks.map((task: any) => ({
            id: task.id,
            status: task.status,
            title: task.title,
            description: task.description,
            user: task.user.name,
            createdAt: task.createdAt,
        }));

        const formatted_archived_tasks = archived_tasks.map((task: any) => ({
            id: task.id,
            status: task.status,
            title: task.title,
            description: task.description,
            user: task.user.name,
            createdAt: task.createdAt,
        }));

        const { type, project, description } = environment;
        const { name, last_name } = environment.project.client;

        return new DesignEntity(
            { id, type: type.name, project: project.title, client: `${name} ${last_name}`, description, status },
            { pending_tasks: formatted_pending_tasks, process_tasks: formatted_process_tasks, finished_tasks: formatted_finished_tasks, archived_tasks: formatted_archived_tasks }
        );
    }
}