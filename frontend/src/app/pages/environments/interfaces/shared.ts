export type Status = "PENDIENTE" | "PROCESO" | "PAUSADO" | "FINALIZADO" | "CANCELADO";
export enum StatusColor {
    PENDIENTE = "#FFD966",
    PROCESO = "#B5D6A7",
    PAUSADO = "#CCCCCC",
    FINALIZADO = "#5A965A",
    CANCELADO = "#CC3333",
}

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

export type Priority = "BAJA" | "MEDIA" | "ALTA" | "URGENTE";
export enum PriorityColor {
    BAJA = "#B5D6A7",
    MEDIA = "#FFF47A",
    ALTA = "#FD9800",
    URGENTE = "#F55D1E",
}

export type Difficulty = "BAJA" | "MEDIA" | "ALTA";
export enum DifficultyColor {
    BAJA = "#B5D6A7",
    MEDIA = "#FFF47A",
    ALTA = "#FD9800",
}

// Colores asociados a los estados
const statusColors: { [key in Status]: string } = {
    PENDIENTE: "#FFD966",
    PROCESO: "#B5D6A7",
    PAUSADO: "#CCCCCC",
    FINALIZADO: "#5A965A",
    CANCELADO: "#CC3333",
};

const designStatusColors: { [key in DesignStatus]: string } = {
    PENDIENTE: "#FFD966",
    PROCESO: "#B5D6A7",
    PAUSADO: "#CCCCCC",
    PRESENTADO: "#4F81BD",
    CAMBIOS: "#FFD100",
    FINALIZADO: "#5A965A",
    CANCELADO: "#CC3333",
};

// Exportar los colores para su uso en el código
export { statusColors, designStatusColors };