export interface SupplierBasicInfo {
    id: number;
    name: string;
    locality: string;
}

export enum MovementTypes {
    NEW_PURCHASE = "NEW_PURCHASE",
    DEL_PURCHASE = "DEL_PURCHASE",
    NEW_PAYMENT = "NEW_PAYMENT",
    NEW_CLIENT_PAYMENT = "NEW_CLIENT_PAYMENT",
    DEL_CLIENT_PAYMENT = "DEL_CLIENT_PAYMENT",
    POS_ADJ = "POS_ADJ",
    NEG_ADJ = "NEG_ADJ",
}

export const types: Record<
    MovementTypes,
    { label: string; icon: string; title: string }
> = {
    [MovementTypes.NEW_PURCHASE]: {
        label: "NUEVA COMPRA",
        icon: "bi bi-arrow-down-circle-fill fs-6 me-1 text-danger",
        title: "Aumenta la deuda con el proveedor",
    },
    [MovementTypes.DEL_PURCHASE]: {
        label: "COMPRA ANULADA",
        icon: "bi bi-x-circle-fill fs-6 me-1 text-secondary",
        title: "Disminuye la deuda con el proveedor",
    },
    [MovementTypes.NEW_PAYMENT]: {
        label: "PAGO PROPIO",
        icon: "bi bi-arrow-up-circle-fill fs-6 me-1 text-success",
        title: "Disminuye la deuda con el proveedor",
    },
    [MovementTypes.NEW_CLIENT_PAYMENT]: {
        label: "PAGO DE CLIENTE",
        icon: "bi bi-arrow-up-circle-fill fs-6 me-1 text-success",
        title: "Disminuye la deuda con el proveedor",
    },
    [MovementTypes.DEL_CLIENT_PAYMENT]: {
        label: "PAGO DE CLIENTE ANULADO",
        icon: "bi bi-x-circle-fill fs-6 me-1 text-secondary",
        title: "Aumenta la deuda con el proveedor",
    },
    [MovementTypes.POS_ADJ]: {
        label: "AJUSTE A FAVOR",
        icon: "bi bi-arrow-up-circle-fill fs-6 me-1 text-success",
        title: "Disminuye la deuda con el proveedor",
    },
    [MovementTypes.NEG_ADJ]: {
        label: "AJUSTE EN CONTRA",
        icon: "bi bi-arrow-down-circle-fill fs-6 me-1 text-danger",
        title: "Aumenta la deuda con el proveedor",
    },
};

export enum Movements {
    NEW_PURCHASE = "NUEVA COMPRA",
    DEL_PURCHASE = "COMPRA ANULADA",
    NEW_PAYMENT = "PAGO PROPIO",
    NEW_CLIENT_PAYMENT = "PAGO DE CLIENTE",
    DEL_CLIENT_PAYMENT = "PAGO DE CLIENTE ANULADO",
    POS_ADJ = "AJUSTE A FAVOR",
    NEG_ADJ = "AJUSTE EN CONTRA",
}

export interface SupplierAccountInterface {
    id: number;
    supplier: {
        id: number;
        name: string;
        locality: string;
    };
    currency: {
        name: string;
        symbol: string;
        is_monetary: boolean;
    };
    balance: number;
}

interface ProjectInterface {
    id_project: number;
    id_account: number;
    id_movement: number;
    client: string;
}

export interface DataRow {
    id: number;
    createdAt: Date;
    user: string;
    description: string;
    type: MovementTypes;
    prev_balance: number;
    amount: number;
    post_balance: number;
    id_purchase?: number;
    project?: ProjectInterface;
}

export interface InitialFormInterface {
    type: 'NEW_PURCHASE' | 'DEL_PURCHASE' | 'NEW_PAYMENT' | 'NEW_CLIENT_PAYMENT' | 'DEL_CLIENT_PAYMENT' | 'POS_ADJ' | 'NEG_ADJ' | '';
    description: string;
    amount: number;
}