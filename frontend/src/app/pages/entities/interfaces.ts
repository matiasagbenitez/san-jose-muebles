export interface EntityInterface {
    id: number;
    name: string;
    dni_cuit: string;
    phone: string;
    email: string;
    address: string;
    id_locality: string;
    annotations: string;
    locality: string;
}

export interface EntityAccountInterface {
    id: number;
    currency: {
        name: string;
        symbol: string;
        is_monetary: boolean;
    };
    balance: number;
    updatedAt: Date;
}

export interface InitialFormInterface {
    type: 'PAYMENT' | 'DEBT' | 'POS_ADJ' | 'NEG_ADJ' | '';
    description: string;
    amount: number;
}

export interface EntityBasicInfoInterface {
    id: number;
    name: string;
    locality: string;
}

export enum MovementType {
    PAYMENT = "PAYMENT",
    DEBT = "DEBT",
    NEG_ADJ = "NEG_ADJ",
    POS_ADJ = "POS_ADJ",
}

export const types: Record<MovementType, { label: string; icon: string; title: string }> = {
    [MovementType.PAYMENT]: {
        label: "PAGO / CANCELACIÓN",
        icon: "bi bi-arrow-up-circle-fill fs-6 me-1 text-success",
        title: "Disminuye la deuda de la empresa",
    },
    [MovementType.DEBT]: {
        label: "DEUDA / OBLIGACIÓN",
        icon: "bi bi-arrow-down-circle-fill fs-6 me-1 text-danger",
        title: "Aumenta la deuda de la empresa",
    },
    [MovementType.POS_ADJ]: {
        label: "AJUSTE A FAVOR",
        icon: "bi bi-arrow-up-circle-fill fs-6 me-1 text-success",
        title: "Disminuye la deuda de la empresa",
    },
    [MovementType.NEG_ADJ]: {
        label: "AJUSTE EN CONTRA",
        icon: "bi bi-arrow-down-circle-fill fs-6 me-1 text-danger",
        title: "Aumenta la deuda de la empresa",
    },
};

export interface AccountInterface {
    id: number;
    entity: string;
    locality: string;
    currency: {
        name: string;
        symbol: string;
        is_monetary: boolean;
    };
    balance: number;
}

export enum Movements {
    PAYMENT = "PAGO / CANCELACIÓN",
    DEBT = "DEUDA / OBLIGACIÓN",
    POS_ADJ = "AJUSTE A FAVOR",
    NEG_ADJ = "AJUSTE EN CONTRA",
}

interface CurrencyInterface {
    name: string;
    symbol: string;
    is_monetary: boolean;
}

export interface EntityTransactionDetailInterface {
    id: string;
    entity: EntityBasicInfoInterface;
    currency: CurrencyInterface;
    id_entity_account: string;
    type: 'PAYMENT' | 'DEBT' | 'POS_ADJ' | 'NEG_ADJ';
    description: string;
    prev_balance: number;
    amount: number;
    post_balance: number;
    user: string;
    createdAt: Date;
}