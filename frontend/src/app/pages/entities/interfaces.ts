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