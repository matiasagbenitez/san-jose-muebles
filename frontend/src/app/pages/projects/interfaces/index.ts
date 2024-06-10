import { DesignStatus } from "../../design/interfaces";

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

export interface ProjectEvolution {
    id: string;
    status: Status;
    comment: string;
    user: string;
    createdAt: Date;
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

export interface UpdateProjectFormInterface {
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
    requested_deadline: Date | null;
    estimated_deadline: Date | null;
    createdAt: Date;

    environments: Environment[];
}

export interface Environment {
    id: number;
    type: string;
    des_status: DesignStatus;
    fab_status: string;
    ins_status: string;
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
        id: number;
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
        icon: "bi bi-arrow-up-circle-fill fs-6 me-1 text-success",
        title: "Disminuye la deuda del cliente",
    },
    [MovementType.NEW_SUPPLIER_PAYMENT]: {
        label: "PAGO A PROVEEDOR",
        icon: "bi bi-arrow-up-circle-fill fs-6 me-1 text-success",
        title: "Disminuye la deuda del cliente",
    },
    [MovementType.POS_ADJ]: {
        label: "AJUSTE A FAVOR",
        icon: "bi bi-arrow-up-circle-fill fs-6 me-1 text-success",
        title: "Disminuye la deuda del cliente",
    },
    [MovementType.NEG_ADJ]: {
        label: "AJUSTE EN CONTRA",
        icon: "bi bi-arrow-down-circle-fill fs-6 me-1 text-danger",
        title: "Aumenta la deuda del cliente",
    },
};

export interface ParamsInterface {
    id: number;
    name: string;
}

export interface EstimateItemInterface {
    quantity: number;
    description: string;
    price: number;
    subtotal: number;
}
export interface EstimateFormInterface {
    gen_date: string | Date;
    valid_period: number | string;
    client_name: string;
    title: string;
    id_currency: string;
    subtotal: number;
    discount: number;
    fees: number;
    total: number;
    guarantee: string;
    observations: string;
    items: EstimateItemInterface[];

    percent_discount: number;
    percent_fees: number;
}

export enum EstimateStatuses {
    NO_ENVIADO = "#FFD966",
    ENVIADO = "#4F81BD",
    ACEPTADO = "#5A965A",
    RECHAZADO = "#CC3333",
}

export enum EstimateStatusesText {
    NO_ENVIADO = "NO ENVIADO",
    ENVIADO = "ENVIADO",
    ACEPTADO = "ACEPTADO",
    RECHAZADO = "RECHAZADO",
}
export interface ProyectBasicData {
    id: number;
    title: string;
    status: "PENDIENTE" | "PROCESO" | "PAUSADO" | "FINALIZADO" | "CANCELADO";
    client: string;
    locality: string;
}

export interface CurrencyInterface {
    id: string;
    name: string;
    symbol: string;
    is_monetary: boolean;
}

export interface InitialForm {
    type: string;
    description: string;
    amount: number;
    id_currency: string;
    equivalent_amount: number;
    id_supplier_account?: string;
}

export type Status = "PENDIENTE" | "PROCESO" | "PAUSADO" | "FINALIZADO" | "CANCELADO";
export enum StatusColor {
    PENDIENTE = "#FFD966",
    PROCESO = "#B5D6A7",
    PAUSADO = "#CCCCCC",
    FINALIZADO = "#5A965A",
    CANCELADO = "#CC3333",
}

export const ProjectStatuses: Record<
    Status,
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
    FINALIZADO: {
        text: "FINALIZADO",
        icon: "bi bi-check-circle-fill text-success me-2",
    },
    CANCELADO: {
        text: "CANCELADO",
        icon: "bi bi-x-circle-fill text-danger me-2",
    },
};

export interface ProjectEnvironmentDetailInterface {
    id: number;
    id_project: number;
    project: string;
    id_client: number;
    client: string;
    client_phone: string;
    type: string;
    difficulty: 'BAJA' | 'MEDIA' | 'ALTA';
    priority: 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE';
    description: string;
    des_id: number;
    des_status: DesignStatus;
    des_last_update: Date;
    fab_id: number;
    fab_status: Status;
    fab_last_update: Date;
    ins_id: number;
    ins_status: Status;
    ins_last_update: Date;
    req_deadline: Date | null;
    est_deadline: Date | null;
}