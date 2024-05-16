import { CustomError } from '../../errors/custom.error';

export class EstimatesByProjectListEntity {
    constructor(
        public id: number,
        public title: string,
        public description: string,
        public status: 'ACEPTADO' | 'PENDIENTE' | 'RECHAZADO',
        public created_at: Date,
        public currency: {
            name: string,
            symbol: string,
            is_monetary: boolean,
        },
        public total: number,
    ) { }

    static fromObject(object: { [key: string]: any }): EstimatesByProjectListEntity {
        const { id, title, description, status, createdAt, currency, total } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!title) throw CustomError.badRequest('Falta el título');
        if (!status) throw CustomError.badRequest('Falta el estado');
        if (!createdAt) throw CustomError.badRequest('Falta la fecha de creación');
        if (!currency) throw CustomError.badRequest('Falta la moneda');
        if (!currency.name || !currency.symbol || currency.is_monetary === undefined) throw CustomError.badRequest('Falta información de la moneda');
        if (!total) throw CustomError.badRequest('Falta el total');

        return new EstimatesByProjectListEntity(
            id,
            title,
            description,
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