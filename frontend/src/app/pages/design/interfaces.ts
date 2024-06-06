import { DesignStatus } from "../environments/interfaces";

export interface Task {
    id: string;
    status: 'PENDIENTE' | 'PROCESO' | 'FINALIZADO' | 'CANCELADO';
    title: string;
    description: string;
    user: string;
    createdAt: Date;
}

export interface Comment {
    id: string;
    comment: string;
    user: string;
    createdAt: Date;
}
export interface DesignEntity {
    id: string;

    type: string;
    project: string;
    client: string;
    description: string;

    status: DesignStatus;

    tasks: {
        pending_tasks: Task[];
        process_tasks: Task[];
        finished_tasks: Task[];
        canceled_tasks: Task[];
    };
}