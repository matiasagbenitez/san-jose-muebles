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

export interface ProjectDetailInterface {
    id: number;
    title: string;
    status: "PENDIENTE" | "PROCESO" | "PAUSADO" | "FINALIZADO" | "CANCELADO";
    priority: "BAJA" | "MEDIA" | "ALTA" | "URGENTE";
    id_client: string;
    client: string;
    client_phone: string;
    locality: string;
    address: string;
    env_total: number;
    env_des: number;
    env_fab: number;
    env_ins: number;
    requested_deadline: Date | null;
    estimated_deadline: Date | null;
    createdAt: Date;
}

export interface ProjectAccountsInterface {
    project: ProjectBasicData;
    accounts: ProjectAccountsData[];
}

export interface ProjectBasicData {
    id: number;
    title: string;
    client: string;
    locality: string;
    status: "PENDIENTE" | "PROCESO" | "PAUSADO" | "FINALIZADO" | "CANCELADO";
}

export interface ProjectAccountsData {
    id: number;
    currency: {
        name: string;
        symbol: string;
        is_monetary: boolean;
    };
    balance: number;
    updatedAt: Date;
}

export interface AccountInterface {
    id: number;
    client: string;
    locality: string;
    title: string;
    status: "PENDIENTE" | "PAUSADO" | "PROCESO" | "FINALIZADO" | "CANCELADO";
    currency: AccountCurrency;
    balance: number;
}

export interface AccountCurrency {
    id: string;
    name: string;
    symbol: string;
    is_monetary: boolean;
}

export interface TransactionDataRow {
    id: number;
    createdAt: Date;
    user: string;
    type:
    | "NEW_PAYMENT"
    | "POS_ADJ"
    | "NEG_ADJ"
    | "NEW_SUPPLIER_PAYMENT";
    description: string;
    received_amount: number;
    currency: string;
    is_monetary: boolean;
    prev_balance: number;
    equivalent_amount: number;
    post_balance: number;
    supplier?: {
        id_account: number;
        id_movement: number;
        supplier: string;
    };
}

export enum MovementType {
    NEW_PAYMENT = "NEW_PAYMENT",
    NEW_SUPPLIER_PAYMENT = "NEW_SUPPLIER_PAYMENT",
    POS_ADJ = "POS_ADJ",
    NEG_ADJ = "NEG_ADJ",
}

export enum Movements {
    NEW_PAYMENT = "PAGO DEL CLIENTE",
    POS_ADJ = "AJUSTE A FAVOR",
    NEG_ADJ = "AJUSTE EN CONTRA",
    NEW_SUPPLIER_PAYMENT = "PAGO A PROVEEDOR",
}

export const types: Record<
    MovementType,
    { label: string; icon: string; title: string }
> = {
    [MovementType.NEW_PAYMENT]: {
        label: "PAGO DEL CLIENTE",
        icon: "bi bi-arrow-up-circle-fill fs-6 text-success",
        title: "Disminuye la deuda del cliente",
    },
    [MovementType.NEW_SUPPLIER_PAYMENT]: {
        label: "PAGO A PROVEEDOR",
        icon: "bi bi-arrow-up-circle-fill fs-6 text-success",
        title: "Disminuye la deuda del cliente",
    },
    [MovementType.POS_ADJ]: {
        label: "AJUSTE A FAVOR",
        icon: "bi bi-arrow-up-circle-fill fs-6 text-success",
        title: "Disminuye la deuda del cliente",
    },
    [MovementType.NEG_ADJ]: {
        label: "AJUSTE EN CONTRA",
        icon: "bi bi-arrow-down-circle-fill fs-6 text-danger",
        title: "Aumenta la deuda del cliente",
    },
};

export interface ParamsInterface {
    id: number;
    name: string;
}