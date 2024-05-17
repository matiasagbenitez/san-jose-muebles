import { CustomError } from '../../errors/custom.error';

interface Project {
    id: string,
    title: string,
    client: string,
    locality: string,
    status: 'PENDIENTE' | 'PAUSADO' | 'PROCESO' | 'FINALIZADO' | 'CANCELADO',
}

interface EstimateItem {
    quantity: number,
    description: string,
    price: number,
    subtotal: number,
}

interface EstimateEvolution {
    status: 'NO_ENVIADO' | 'ENVIADO' | 'ACEPTADO' | 'RECHAZADO',
    comment: string,
    user: string,
    created_at: Date,
}

export class EstimateDetailEntity {
    constructor(
        public id: number,
        public project: Project,

        public gen_date: Date,
        public val_date: Date | null,
        public client_name: string,
        public title: string,
        public description: string,
        public status: 'NO_ENVIADO' | 'ENVIADO' | 'ACEPTADO' | 'RECHAZADO',

        public currency: {
            id: string,
            name: string,
            symbol: string,
            is_monetary: boolean,
        },

        public items: EstimateItem[],

        public subtotal: number,
        public discount: number,
        public fees: number,
        public total: number,

        public guarantee: string,
        public observations: string,

        public created_at: Date,
        public user: string,

        public evolutions?: EstimateEvolution[],
    ) { }

    static fromObject(object: { [key: string]: any }): EstimateDetailEntity {
        const { id, project, gen_date, val_date, client_name, title, description, status, currency, items, subtotal, discount, fees, total, guarantee, observations, createdAt, user, evolutions } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!project) throw CustomError.badRequest('Falta el proyecto');
        if (!gen_date) throw CustomError.badRequest('Falta la fecha de generación');
        if (!client_name) throw CustomError.badRequest('Falta el nombre del cliente');
        if (!title) throw CustomError.badRequest('Falta el título');
        if (!status) throw CustomError.badRequest('Falta el estado');
        if (!currency) throw CustomError.badRequest('Falta la moneda');

        if (items) {
            if (!subtotal) throw CustomError.badRequest('Falta el subtotal');
            if (isNaN(discount)) throw CustomError.badRequest('El descuento debe ser un número');
            if (isNaN(fees)) throw CustomError.badRequest('El valor de impuestos debe ser un número');
            if (!total) throw CustomError.badRequest('Falta el total');
            if (!items) throw CustomError.badRequest('Falta la lista de ítems');
        }

        if (!guarantee) throw CustomError.badRequest('Falta la garantía');

        const formatted_items: EstimateItem[] = items.map((item: any) => {
            return {
                quantity: item.quantity,
                description: item.description,
                price: item.price,
                subtotal: item.subtotal,
            };
        });

        const formatted_evolutions: EstimateEvolution[] = evolutions.map((evolution: any) => {
            return {
                status: evolution.status,
                comment: evolution.comment,
                user: evolution.user.name,
                created_at: evolution.createdAt,
            };
        });

        return new EstimateDetailEntity(
            id,
            {
                id: project.id,
                title: project.title,
                client: project.client.name + ' ' + project.client.last_name,
                locality: project.locality.name,
                status: project.status,
            },
            gen_date,
            val_date,
            client_name,
            title,
            description,
            status,
            {
                id: currency.id,
                name: currency.name,
                symbol: currency.symbol,
                is_monetary: currency.is_monetary,
            },
            formatted_items,
            subtotal,
            discount,
            fees,
            total,
            guarantee,
            observations,
            createdAt,
            user.name,
            formatted_evolutions,
        );

    }
}