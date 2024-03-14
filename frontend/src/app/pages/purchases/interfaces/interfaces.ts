export interface SupplierInfoProps {
    date: Date;
    name: string;
    dni_cuit: string;
    phone: string;
    locality: string;
}

export interface PurchaseInfoProps {
    currency: string;
    is_monetary: boolean;
    subtotal: number;
    discount: number;
    other_charges: number;
    total: number;
    paid_amount: number;
    credit_balance: number;
    payed_off: boolean;
    fully_stocked: boolean;
    nullified: boolean;
}