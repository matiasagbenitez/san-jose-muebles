import { CustomError } from '../../errors/custom.error';

export class EstimatesByProjectListEntity {
    constructor(
        public id: number,
        public status: 'VALIDO' | 'ENVIADO' | 'ACEPTADO' | 'RECHAZADO' | 'ANULADO',
        public created_at: Date,
        public currency: {
            name: string,
            symbol: string,
            is_monetary: boolean,
        },
        public total: number,
    ) { }

    static fromObject(object: { [key: string]: any }): EstimatesByProjectListEntity {
        const { id, status, createdAt, currency, total } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!status) throw CustomError.badRequest('Falta el estado');
        if (!createdAt) throw CustomError.badRequest('Falta la fecha de creación');
        if (!currency) throw CustomError.badRequest('Falta la moneda');
        if (!currency.name || !currency.symbol || currency.is_monetary === undefined) throw CustomError.badRequest('Falta información de la moneda');
        if (!total) throw CustomError.badRequest('Falta el total');

        return new EstimatesByProjectListEntity(
            id,
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