export interface ProductInterface {
    id: string;
    code: string;
    name: string;
    description: string;
    id_brand: string;
    id_category: string;
    id_unit: string;
    actual_stock: number;
    inc_stock: number;
    min_stock: number;
    ideal_stock: number;
    last_price: number;
    id_currency: string;
}
