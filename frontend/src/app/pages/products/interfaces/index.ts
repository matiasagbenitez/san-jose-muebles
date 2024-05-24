export interface ProductPendingReception {
    id: string;
    date: Date;
    supplier: string;
    id_purchase: string;
    pending_stock: string;
}

interface StockLotItem {
    id_product: string;
    quantity: number;
}

export interface StockLot {
    type: 'INCREMENT' | 'DECREMENT';
    description: string;
    stock_list: StockLotItem[];
}

export interface ProductSelect2Option {
    id: string;
    label: string;
    stock: string;
}