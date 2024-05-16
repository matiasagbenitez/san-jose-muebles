import { CustomError } from '../../errors/custom.error';

export class EstimatesListEntity {
    constructor(
        public id: number,
        public client: {
            id: number,
            name: string,
            last_name: string,
        },
        public project: string,
        public status: 'ACEPTADO' | 'PENDIENTE' | 'RECHAZADO',
        public created_at: string,
        public currency: {
            name: string,
            symbol: string,
            is_monetary: boolean,
        },
        public total: string,
    ) { }

    static fromObject(object: { [key: string]: any }): EstimatesListEntity {
        const { id, project, status, createdAt, currency, total } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!project) throw CustomError.badRequest('Falta el proyecto');
        if (!project.client) throw CustomError.badRequest('Falta el cliente');
        if (!status) throw CustomError.badRequest('Falta el estado');
        if (!createdAt) throw CustomError.badRequest('Falta la fecha de creación');
        if (!currency) throw CustomError.badRequest('Falta la moneda');
        if (!currency.name || !currency.symbol || currency.is_monetary === undefined) throw CustomError.badRequest('Falta información de la moneda');
        if (!total) throw CustomError.badRequest('Falta el total');

        return new EstimatesListEntity(
            id,
            {
                id: project.client.id,
                name: project.client.name,
                last_name: project.client.last_name,
            },
            project.title,
            status,
            createdAt,
            {
                name: currency.name,
                symbol: currency.symbol,
                is_monetary: currency.is_monetary,
            },
            total,
        );

    }
}