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