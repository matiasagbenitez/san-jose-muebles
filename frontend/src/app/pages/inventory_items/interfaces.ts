export interface EditableItem {
    id_inventory_categ: number;
    id_inventory_brand: number;
    name: string;
}

export interface EvolutionsData {
    id: number;
    status: "OPERATIVO" | "RESERVADO" | "RETIRADO" | "DESCARTADO";
    comment: string;
    user: string;
    at: Date;
}

export interface ItemData {
    id: number;
    category: string;
    brand: string;
    code: string;
    name: string;
    status: "OPERATIVO" | "RESERVADO" | "RETIRADO" | "DESCARTADO";
    evolutions: EvolutionsData[];
}

export interface InventoryDataRow {
    id: number;
    category: string;
    brand: string;
    code: string;
    name: string;
    status: "OPERATIVO" | "RESERVADO" | "RETIRADO" | "DESCARTADO";
}

export enum InventoryStatus {
    RESERVADO = "#5A966A",
    OPERATIVO = "#B5D6A7",
    RETIRADO = "#FFF47A",
    DESCARTADO = "#FD9800",
}