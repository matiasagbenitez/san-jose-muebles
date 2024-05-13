import { CustomError } from '../../errors/custom.error';

interface ProjectInterface {
    id_project: number;
    id_account: number;
    id_movement: number;
    client: string;
}
export class SupplierAccountTransactionEntity {
    constructor(
        public id: string,
        public createdAt: Date,
        public user: string,
        public type: string,
        public description: string,
        public prev_balance: number,
        public amount: number,
        public post_balance: number,
        public id_purchase?: number,
        public project: ProjectInterface | undefined = undefined,
    ) { }

    static fromObject(object: { [key: string]: any }): SupplierAccountTransactionEntity {
        const { id, type, createdAt, user, description, prev_balance, amount, post_balance, purchase_transaction, project_supplier_transaction } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!type) throw CustomError.badRequest('Falta el tipo');
        if (!createdAt) throw CustomError.badRequest('Falta la fecha de creación');
        if (!user) throw CustomError.badRequest('Falta el usuario');
        if (!description) throw CustomError.badRequest('Falta la descripción');
        if (!prev_balance) throw CustomError.badRequest('Falta el saldo anterior');
        if (!amount) throw CustomError.badRequest('Falta el monto');
        if (!post_balance) throw CustomError.badRequest('Falta el saldo posterior');

        let project_data: ProjectInterface | undefined = undefined;
        if (project_supplier_transaction) {
            const { name, last_name } = project_supplier_transaction.project_transaction.account.project.client;
            project_data = {
                id_project: project_supplier_transaction.project_transaction.account.project.id,
                id_account: project_supplier_transaction.project_transaction.account.id,
                id_movement: project_supplier_transaction.id_project_account_transaction,
                client: `${name} ${last_name}`,
            };
        }

        if (!project_data || !project_data.id_project || !project_data.id_account || !project_data.id_movement || !project_data.client) {
            project_data = undefined;
        }

        return new SupplierAccountTransactionEntity(
            id,
            createdAt,
            user.name,
            type,
            description,
            prev_balance,
            amount,
            post_balance,
            purchase_transaction ? purchase_transaction.id_purchase : undefined,
            project_data,
        );
    }
}