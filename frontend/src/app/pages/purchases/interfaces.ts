export interface NullationInterface {
    by: string;
    at: Date;
    reason: string;
}

export interface ResumeInterface {
    date: Date;
    supplier: {
        id: number;
        name: string;
        locality: string;
    };
    currency: string;
    is_monetary: boolean;
    total: number;
    created_at: Date;
    created_by: string;
}

export interface ItemInterface {
    id: number;
    quantity: number;
    unit: string;
    brand: string;
    product: string;
    price: number;
    subtotal: number;
    actual_stocked: number;
    fully_stocked: boolean;
}




export interface ReceptionDataInterface {
    id: number;
    supplier: string;
    date: string;
}

export interface ReceptionInterface {
    id: number;
    user: string;
    date: Date;
    quant: number;
}

export interface ProductReceptionInterface {
    id: number;
    prod: string;
    quant: number;
    recep: ReceptionInterface[];
}

export interface PurchaseReceptionInterface {
    id: number;
    user: string;
    date: Date;
}