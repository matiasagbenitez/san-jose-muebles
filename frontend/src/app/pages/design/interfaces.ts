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

export interface DesignList {
    id: string;
    environment: string;
    project: string;
    client: string;
    status: DesignStatus;
    createdAt: Date;
    updatedAt: Date;
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
        archived_tasks: Task[];
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

export const DesignStatuses: Record<
    DesignStatus,
    { text: string; icon: string }
> = {
    PENDIENTE: {
        text: "PENDIENTE",
        icon: "bi bi-clock-fill text-warning me-2",
    },
    PROCESO: {
        text: "EN PROCESO",
        icon: "bi bi-play-circle-fill text-primary me-2",
    },
    PAUSADO: {
        text: "EN PAUSA",
        icon: "bi bi-pause-circle-fill text-secondary me-2",
    },
    PRESENTAR: {
        text: "PARA PRESENTAR",
        icon: "bi bi-clock-history me-2",
    },
    PRESENTADO: {
        text: "PRESENTADO A CLIENTE",
        icon: "bi bi-person-circle me-2",
    },
    REVISION: {
        text: "EN REVISIÓN",
        icon: "bi bi-exclamation-circle-fill me-2 text-primary-emphasis"

    },
    FINALIZADO: {
        text: "FINALIZADO",
        icon: "bi bi-check-circle-fill text-success me-2",
    },
    CANCELADO: {
        text: "CANCELADO",
        icon: "bi bi-x-circle-fill text-danger me-2",
    },
};

export interface DesignFile {
    id: string;
    id_design: string;
    originalname: string;
    slug: string;
    path: string;

    fileUrl: string;

    size: number;
    mimetype: string;
    image: string;
    id_user: string;
    createdAt: Date;
    updatedAt: Date;
}