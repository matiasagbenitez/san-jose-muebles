import { CustomError } from '../../errors/custom.error';

export class ProjectAccountListEntity {
    constructor(
        public id: string,
        public project: string,
        public currency: string,
        public symbol: string,
        public is_monetary: boolean,
        public balance: number,
        public updatedAt?: Date
    ) { }

    static fromObject(object: { [key: string]: any }): ProjectAccountListEntity {
        const { id, project, currency, balance, updatedAt } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!project) throw CustomError.badRequest('Falta el proyecto');
        if (!currency) throw CustomError.badRequest('Falta la moneda');
        if (!balance) throw CustomError.badRequest('Falta el saldo');

        return new ProjectAccountListEntity(
            id,
            project.title,
            currency.name + ' (' + currency.symbol + ')',
            currency.symbol,
            currency.is_monetary,
            balance,
            updatedAt
        );
    }
}