import { CustomError } from '../../errors/custom.error';

export class ProjectAccountDetailEntity {
    constructor(
        public id: string,
        public project: string,
        public currency: string,
        public symbol: string,
        public is_monetary: boolean,
        public balance: number,
    ) { }

    static fromObject(object: { [key: string]: any }): ProjectAccountDetailEntity {
        const { id, project, currency, balance } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!project) throw CustomError.badRequest('Falta el proyecto');
        if (!currency) throw CustomError.badRequest('Falta la moneda');
        if (!balance) throw CustomError.badRequest('Falta el saldo');

        return new ProjectAccountDetailEntity(
            id,
            project.title || "Sin título",
            currency.name + ' (' + currency.symbol + ')',
            currency.symbol,
            currency.is_monetary,
            balance
        );
    }
}