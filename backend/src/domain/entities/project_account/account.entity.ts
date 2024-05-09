import { CustomError } from '../../errors/custom.error';

export class ProjectAccountEntity {
    constructor(
        public id: string,
        public client: string,
        public locality: string,
        public title: string,
        public status: 'PENDIENTE' | 'PAUSADO' | 'PROCESO' | 'FINALIZADO' | 'CANCELADO',

        public currency: {
            name: string,
            symbol: string,
            is_monetary: boolean,
        },
        public balance: number,
    ) { }

    static fromObject(object: { [key: string]: any }): ProjectAccountEntity {
        const { id, project, currency, balance } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!project) throw CustomError.badRequest('Falta el proyecto');
        if (!currency) throw CustomError.badRequest('Falta la moneda');
        if (!balance) throw CustomError.badRequest('Falta el saldo');

        return new ProjectAccountEntity(
            id,
            project.client.name + ' ' + project.client.last_name,
            project.locality.name,
            project.title,
            project.status,
            {
                name: currency.name,
                symbol: currency.symbol,
                is_monetary: currency.is_monetary,
            },
            balance
        );
    }
}