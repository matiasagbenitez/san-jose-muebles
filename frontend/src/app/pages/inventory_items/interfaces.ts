export interface EditableItem {
    id_inventory_categ: number;
    id_inventory_brand: number;
    quantity: number;
    name: string;
}

export interface ItemData {
    id: number;
    category: string;
    brand: string;
    quantity: number;
    code: string;
    name: string;
    last_check: Date;
    last_check_by: string;
    is_retired: boolean;
}

export interface UpdatesData {
    id: number;
    updated_at: Date;
    prev_quantity: number;
    new_quantity: number;
    updated_by: string;
}

export interface RetirementsData {
    id: number;
    retired_at: Date;
    reason: string;
    retired_by: string;
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