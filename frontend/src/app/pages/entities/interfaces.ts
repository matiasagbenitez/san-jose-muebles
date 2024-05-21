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

export const types: Record<
    MovementType,
    { label: string; icon: string; title: string }
> = {
    [MovementType.PAYMENT]: {
        label: "PAGO / ABONO",
        icon: "bi bi-arrow-up-circle-fill fs-6 text-success",
        title: "Disminuye la deuda de la empresa",
    },
    [MovementType.DEBT]: {
        label: "DEUDA / CARGO",
        icon: "bi bi-arrow-down-circle-fill fs-6 text-danger",
        title: "Aumenta la deuda de la empresa",
    },
    [MovementType.POS_ADJ]: {
        label: "AJUSTE A FAVOR",
        icon: "bi bi-arrow-up-circle-fill fs-6 text-success",
        title: "Disminuye la deuda de la empresa",
    },
    [MovementType.NEG_ADJ]: {
        label: "AJUSTE EN CONTRA",
        icon: "bi bi-arrow-down-circle-fill fs-6 text-danger",
        title: "Aumenta la deuda de la empresa",
    },
};