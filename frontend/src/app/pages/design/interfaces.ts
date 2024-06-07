export type DesignStatus = "PENDIENTE" | "PROCESO" | "PAUSADO" | "PRESENTAR" | "PRESENTADO" | "REVISION" | "FINALIZADO" | "CANCELADO";
export enum DesignStatusColor {
    PENDIENTE = "#FFD966",
    PROCESO = "#B5D6A7",
    PAUSADO = "#CCCCCC",
    PRESENTAR = "##6796DB",
    PRESENTADO = "#4F81BD",
    REVISION = "#669184",
    FINALIZADO = "#5A965A",
    CANCELADO = "#CC3333",
}
export enum DesignStatusText {
    PENDIENTE = "PENDIENTE",
    PROCESO = "EN PROCESO",
    PAUSADO = "EN PAUSA",
    PRESENTAR = "PRESENTACIÓN PENDIENTE",
    PRESENTADO = "PRESENTADO A CLIENTE",
    REVISION = "REVISIÓN",
    FINALIZADO = "FINALIZADO",
    CANCELADO = "CANCELADO",
}

export type DesignTaskStatus = "PENDIENTE" | "PROCESO" | "FINALIZADA" | "ARCHIVADA";
export enum DesignTaskStatusText {
    PENDIENTE = "PENDIENTE",
    PROCESO = "EN PROCESO",
    FINALIZADA = "FINALIZAR",
    ARCHIVADA = "ARCHIVAR",
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
    status: DesignTaskStatus;
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