import { CustomError } from '../../errors/custom.error';

export class ProjectAccountInfoEntity {
    constructor(
        public id: string,
        public title: string,
        public client: string,
        public locality: string,
        public currency: {
            name: string,
            symbol: string,
            is_monetary: boolean,
        },
        public balance: number,
    ) { }

    static fromObject(object: { [key: string]: any }): ProjectAccountInfoEntity {
        const { id, project, currency, balance } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!project) throw CustomError.badRequest('Falta el proyecto');
        if (!currency) throw CustomError.badRequest('Falta la moneda');
        if (!balance) throw CustomError.badRequest('Falta el saldo');

        const title = project.title || "Proyecto sin título";
        const projectName = title + ' (' + project.client.name + ' - ' + project.locality.name + ')';

        return new ProjectAccountInfoEntity(
            id,
            projectName,
            project.client.name,
            project.locality.name,
            {
                name: currency.name,
                symbol: currency.symbol,
                is_monetary: currency.is_monetary,
            },
            balance
        );
    }
}