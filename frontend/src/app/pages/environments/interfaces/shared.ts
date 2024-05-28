export type Status = "PENDIENTE" | "PROCESO" | "PAUSADO" | "FINALIZADO" | "CANCELADO";
export enum StatusColor {
    PENDIENTE = "#FFD966",
    PROCESO = "#B5D6A7",
    PAUSADO = "#CCCCCC",
    FINALIZADO = "#5A965A",
    CANCELADO = "#CC3333",
}

export type DesignStatus = "PENDIENTE" | "PROCESO" | "PAUSADO" | "PRESENTADO" | "MODIFICANDO" | "FINALIZADO" | "CANCELADO";
export enum DesignStatusColor {
    PENDIENTE = "#FFD966",
    PROCESO = "#B5D6A7",
    PAUSADO = "#CCCCCC",
    PRESENTADO = "#4F81BD",
    MODIFICANDO = "#FFD100",
    FINALIZADO = "#5A965A",
    CANCELADO = "#CC3333",
}