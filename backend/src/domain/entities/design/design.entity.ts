import { CustomError } from '../../errors/custom.error';

interface Task {
    id: string;
    status: 'PENDIENTE' | 'PROCESO' | 'FINALIZADO' | 'CANCELADO';
    title: string;
    description: string;
    user: string;
    createdAt: Date;
}

export class DesignEntity {
    constructor(
        public id: string,

        public type: string,
        public project: string,
        public client: string,
        public description: string,

        public status: string,

        public tasks: {
            pending_tasks: Task[],
            process_tasks: Task[],
            finished_tasks: Task[],
            canceled_tasks: Task[],
        }
    ) { }

    static fromObject(object: { [key: string]: any }): DesignEntity {
        const { id, environment, status, tasks } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!environment) throw CustomError.badRequest('Falta el ambiente');
        if (!status) throw CustomError.badRequest('Falta el estado');

        const pending_tasks = tasks.filter((task: Task) => task.status === 'PENDIENTE');
        const process_tasks = tasks.filter((task: Task) => task.status === 'PROCESO');
        const finished_tasks = tasks.filter((task: Task) => task.status === 'FINALIZADO');
        const canceled_tasks = tasks.filter((task: Task) => task.status === 'CANCELADO');

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

        const formatted_canceled_tasks = canceled_tasks.map((task: any) => ({
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
            id,
            type.name,
            project.title,
            `${name} ${last_name}`,
            description,
            status,
            { pending_tasks: formatted_pending_tasks, process_tasks: formatted_process_tasks, finished_tasks: formatted_finished_tasks, canceled_tasks: formatted_canceled_tasks }
        );
    }
}