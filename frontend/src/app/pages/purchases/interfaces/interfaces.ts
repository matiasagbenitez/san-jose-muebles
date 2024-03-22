interface SupplierInterface {
    id: number;
    name: string;
    locality: string;
}
export interface ResumeInterface {
    date: Date;
    supplier: SupplierInterface;
    currency: string;
    is_monetary: boolean;
    total: number;
    created_at: Date;
    created_by: string;
    nullified: boolean;
    nullified_by: string;
    nullified_date: Date;
    nullified_reason: string;
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

export interface DetailInterface {
    items: ItemInterface[];
    currency: string;
    is_monetary: boolean;
    subtotal: number;
    discount: number;
    other_charges: number;
    total: number;
}

export interface PurchaseDetailInterface {
    id: number;
    resume: ResumeInterface;
    detail: DetailInterface;
}




export interface NullifiedInterface {
    nullifier: string;
    nullified_date: Date;
    nullified_reason: string;
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