export type DesignStatus = "PENDIENTE" | "PROCESO" | "PAUSADO" | "PRESENTADO" | "CAMBIOS" | "FINALIZADO" | "CANCELADO";
export enum DesignStatusColor {
    PENDIENTE = "#FFD966",
    PROCESO = "#B5D6A7",
    PAUSADO = "#CCCCCC",
    PRESENTADO = "#4F81BD",
    CAMBIOS = "#FFD100",
    FINALIZADO = "#5A965A",
    CANCELADO = "#CC3333",
}

export enum DesignStatusText {
    PENDIENTE = "PENDIENTE",
    PROCESO = "EN PROCESO",
    PAUSADO = "EN PAUSA",
    PRESENTADO = "PRESENTADO A CLIENTE",
    CAMBIOS = "CAMBIOS SOLICITADOS",
    FINALIZADO = "FINALIZADO",
    CANCELADO = "CANCELADO",
}

export type DesignTaskStatus = "PENDIENTE" | "PROCESO" | "FINALIZADO" | "CANCELADO";
export enum DesignTaskStatusText {
    PENDIENTE = "PENDIENTE",
    PROCESO = "EN PROCESO",
    FINALIZADO = "FINALIZAR",
    CANCELADO = "ARCHIVAR",
}

export interface Design {
    id: string;
    type: string;
    project: string;
    client: string;
    description: string;
    status: DesignStatus;
}

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
    design: Design;
    tasks: {
        pending_tasks: Task[];
        process_tasks: Task[];
        finished_tasks: Task[];
        canceled_tasks: Task[];
    };
}

export interface DesignEvolution {
    id: string;
    status: DesignStatus;
    comment: string;
    user: string;
    createdAt: Date;
}

export interface DesignTaskEvolution {
    id: string;
    status: DesignTaskStatus;
    user: string;
    createdAt: Date;
}

export interface DesignTaskInterface {
    id: string;
    title: string;
    description: string;
    status: DesignTaskStatus;
    user: string;
    createdAt: Date;
    evolutions: DesignTaskEvolution[];
}