interface EstimateItem {
    quantity: number,
    description: string,
    price: number,
    subtotal: number,
}

export class CreateEstimateDTO {
    private constructor(
        public id_project: number,
        public status: string = 'PENDIENTE',

        public gen_date: Date = new Date(),
        public val_date: Date | null = null,

        public client_name: string,
        public title: string,
        public description: string,
        public id_currency: number,
        public subtotal: number,
        public discount: number,
        public fees: number,
        public total: number,

        public guarantee: string,
        public observations: string,

        public items: EstimateItem[] = [],
        public id_user: number,
    ) { }

    static create(object: { [key: string]: any }): [string?, CreateEstimateDTO?] {
        const { id_project, gen_date, val_date, client_name, title, description, id_currency, subtotal, discount, fees, total, guarantee, observations, items, id_user } = object;

        if (!id_project) return ['El id del proyecto es requerido'];
        if (!gen_date) return ['La fecha de generación es requerida'];

        if (!client_name) return ['El nombre del cliente es requerido'];
        if (!id_currency) return ['La moneda es requerida'];

        
        // Revisar que items cumpla con el formato
        if (!Array.isArray(items)) return ['La lista de ítems debe ser un arreglo'];
        if (items.length > 0) {
            if (!subtotal) return ['El subtotal es requerido'];
            if (isNaN(discount)) return ['El descuento debe ser un número'];
            if (isNaN(fees)) return ['El valor de impuestos debe ser un número'];
            if (!total) return ['El total es requerido'];
            if (!items) return ['La lista de ítems es requerida'];
            let local_subtotal = 0;
            for (let i = 0; i < items.length; i++) {
                const product = items[i];
                if (!product.quantity) return [`La cantidad del ítem ${i + 1} es requerida`];
                if (!product.description) return [`La descripción del ítem ${i + 1} es requerido`];
                if (!product.price) return [`El precio del ítem ${i + 1} es requerido`];
                if (!product.subtotal) return [`El subtotal del ítem ${i + 1} es requerido`];

                // Verificar que los subtotales sean correctos
                const product_subtotal = Math.round(product.price * product.quantity * 100) / 100;
                if (product.subtotal !== product_subtotal) return [`El subtotal del ítem ${i + 1} no coincide con el precio y la cantidad`];
                local_subtotal += product.subtotal;
            }

            if (local_subtotal !== subtotal) return ['El subtotal no coincide con la suma de los subtotales de los productos'];

            const local_total = Math.round((subtotal - discount + fees) * 100) / 100;
            if (local_total !== total) return ['El total no coincide con el cálculo de los subtotales, descuento e impuestos'];
        }

        return [undefined, new CreateEstimateDTO(
            id_project,
            'PENDIENTE',
            gen_date,
            val_date ? new Date(val_date) : null,
            client_name,
            title,
            description,
            id_currency,
            subtotal,
            discount,
            fees,
            total,
            guarantee,
            observations,
            items,
            id_user,
        )];
    }
}