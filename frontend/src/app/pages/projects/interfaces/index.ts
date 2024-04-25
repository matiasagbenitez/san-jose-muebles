export enum Priorities {
    BAJA = "#B5D6A7",
    MEDIA = "#FFF47A",
    ALTA = "#FD9800",
    URGENTE = "#F55D1E",
}

export enum Statuses {
    PENDIENTE = "#FFD966",
    PROCESO = "#B5D6A7",
    PAUSADO = "#CCCCCC",
    FINALIZADO = "#5A965A",
    CANCELADO = "#CC3333",
}

export interface ProjectListable {
    id: number;
    title: string;
    status: "PENDIENTE" | "PROCESO" | "PAUSADO" | "FINALIZADO" | "CANCELADO";
    priority: "BAJA" | "MEDIA" | "ALTA" | "URGENTE";
    client: string;
    locality: string;
    requested_deadline: Date | null;
    createdAt: Date;
}

export interface ProjectFormInterface {
    id_client: string;
    title: string;
    priority: "BAJA" | "MEDIA" | "ALTA" | "URGENTE";
    id_locality: string;
    address: string;
    requested_deadline: Date | null;
    estimated_deadline: Date | null;
}