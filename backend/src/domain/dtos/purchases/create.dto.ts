interface PurchaseItem {
    quantity: number,
    id_product: number,
    price: number,
    subtotal: number,
}

export class CreatePurchaseDTO {
    private constructor(
        public status: string = 'VALIDA',
        public date: Date,

        public id_supplier: number,
        public id_currency: number,

        public subtotal: number,
        public discount: number = 0,
        public other_charges: number = 0,
        public total: number,

        public products_list: PurchaseItem[] = [],

        public fully_stocked: boolean = false,
    ) { }

    static create(object: { [key: string]: any }): [string?, CreatePurchaseDTO?] {
        const { date, id_supplier, id_currency, subtotal, discount, other_charges, total, products_list } = object;

        if (!date) return ['La fecha de la compra es requerida'];
        if (!id_supplier) return ['El proveedor es requerido'];
        if (!id_currency) return ['La moneda es requerida'];

        if (!subtotal) return ['El subtotal es requerido'];
        if (isNaN(discount)) return ['El descuento debe ser un número'];
        if (isNaN(other_charges)) return ['El valor de otros cargos debe ser un número'];
        if (!total) return ['El total es requerido'];
        if (!products_list) return ['La lista de productos es requerida'];

        // Revisar que products_list cumpla con el formato
        if (!Array.isArray(products_list)) return ['La lista de productos debe ser un arreglo'];
        if (products_list.length === 0) return ['La lista de productos no puede estar vacía'];

        let local_subtotal = 0;
        for (let i = 0; i < products_list.length; i++) {
            const product = products_list[i];
            if (!product.quantity) return [`La cantidad del producto ${i + 1} es requerida`];
            if (!product.id_product) return [`El ID del producto ${i + 1} es requerido`];
            if (!product.price) return [`El precio del producto ${i + 1} es requerido`];
            if (!product.subtotal) return [`El subtotal del producto ${i + 1} es requerido`];

            // Verificar que los subtotales sean correctos
            const product_subtotal = Math.round(product.price * product.quantity * 100) / 100;
            if (product.subtotal !== product_subtotal) return [`El subtotal del producto ${i + 1} no coincide con el precio y la cantidad`];
            local_subtotal += product.subtotal;
        }

        if (local_subtotal !== subtotal) return ['El subtotal no coincide con la suma de los subtotales de los productos'];

        const local_total = Math.round((subtotal - discount + other_charges) * 100) / 100;
        if (local_total !== total) return ['El total no coincide con el cálculo de los subtotales, descuento y otros cargos'];

        return [undefined, new CreatePurchaseDTO(
            'VALIDA',
            date,

            id_supplier,
            id_currency,
            subtotal,
            discount,
            other_charges,
            total,

            products_list,
            false,
        )];
    }
}