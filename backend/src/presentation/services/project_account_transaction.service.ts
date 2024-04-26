import { CustomError, PaginationDto, ProjectAccountTransactionEntity, CreateProjectAccountTransactionDTO } from "../../domain";
import { ProjectAccountTransaction } from "../../database/mysql/models";
import { ProjectAccountService } from "./project_account.service";

// ! --- TYPES ---

// NEW_PAYMENT: Nuevo pago del cliente a la empresa (valor positivo, disminuye deuda) -> se crea al momento de registrar un pago del cliente a la empresa

// POS_ADJ: Ajuste positivo (valor positivo, disminuye deuda) -> se crea al momento de registrar un ajuste positivo
// NEG_ADJ: Ajuste negativo (valor negativo, aumenta deuda) -> se crea al momento de registrar un ajuste negativo

// NEW_SUPPLIER_PAYMENT: Nuevo pago de cliente a proyecto (valor positivo, disminuye deuda) -> se crea al momento de registrar un pago de cliente a proyecto
// DEL_SUPPLIER_PAYMENT: Anulación de pago de cliente a proyecto (valor negativo, aumenta deuda) -> se crea al momento de anular un pago de cliente a proyecto

// ! --- TYPES ---

interface DataInterface {

    id_project_account: number;
    // type -> NEW_PAYMENT | POS_ADJ | NEG_ADJ | NEW_SUPPLIER_PAYMENT | DEL_SUPPLIER_PAYMENT
    description?: string;

    received_amount: number;
    id_currency: number;

    prev_balance: number;
    amount: number;
    post_balance: number;

    id_user: number;
}

export class ProjectAccountTransactionService {

    // * GET TRANSACTIONS BY ACCOUNT (PAGINATED) *
    // Obtiene las transacciones de una cuenta corriente paginadas
    public async getTransactionsByAccountPaginated(paginationDto: PaginationDto, id: number) {
        try {
            const { page, limit } = paginationDto;

            const transactions = await ProjectAccountTransaction.findAndCountAll({
                where: { id_project_account: id },
                include: [
                    { association: 'user', attributes: ['name'] },
                    { association: 'currency', attributes: ['name', 'symbol', 'is_monetary'] }
                ],
                order: [['createdAt', 'DESC']],
                offset: (page - 1) * limit,
                limit: limit,
            });

            const items = transactions.rows.map(item => ProjectAccountTransactionEntity.fromObject(item));

            return { items: items, total_items: transactions.count };
        } catch (error: any) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    // * NEW_PAYMENT *
    // El monto del pago disminuye la deuda del cliente con la empresa (númerico positivo)
    // Se crea al momento de registrar un pago por parte de un cliente a la empresa
    public async createTransactionNewPayment(dto: CreateProjectAccountTransactionDTO, id_user: number) {
        try {

            // Verificar si la cuenta del proyecto existe
            const projectAccountService = new ProjectAccountService();
            const projectAccount = await projectAccountService.getProjectAccountById(dto.id_project_account);
            if (!projectAccount) throw CustomError.notFound('¡La cuenta del proyecto no existe!');

            // Calcular el nuevo saldo de la cuenta del proyecto
            const prev_balance = Number(projectAccount.balance);
            const post_balance = prev_balance + Number(dto.equivalent_amount);

            // Registrar la transacción
            await ProjectAccountTransaction.create({
                id_project_account: projectAccount.id,
                type: 'NEW_PAYMENT',
                description: dto.description || 'PAGO DE CLIENTE A LA EMPRESA',
                received_amount: dto.received_amount,
                id_currency: dto.id_currency,
                prev_balance: prev_balance,
                equivalent_amount: dto.equivalent_amount,
                post_balance: post_balance,
                id_user: id_user,
            });

            // Actualizar el saldo de la cuenta del proyecto
            await projectAccountService.updateProjectAccountBalance(projectAccount.id, post_balance);

            return { message: '¡Transacción NEW_PAYMENT registrada correctamente!' };
        } catch (error: any) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    // * POS_ADJ *
    // El monto del ajuste positivo disminuye la deuda del cliente con la empresa (númerico positivo)
    // Se crea al momento de registrar un ajuste positivo
    public async createTransactionPosAdj(dto: CreateProjectAccountTransactionDTO, id_user: number) {
        try {

            // Verificar si la cuenta del proyecto existe
            const projectAccountService = new ProjectAccountService();
            const projectAccount = await projectAccountService.getProjectAccountById(dto.id_project_account);
            if (!projectAccount) throw CustomError.notFound('¡La cuenta del proyecto no existe!');

            // Calcular el nuevo saldo de la cuenta del proyecto
            const prev_balance = Number(projectAccount.balance);
            const post_balance = prev_balance + Number(dto.equivalent_amount);

            // Registrar la transacción
            await ProjectAccountTransaction.create({
                id_project_account: projectAccount.id,
                type: 'POS_ADJ',
                description: dto.description || 'AJUSTE POSITIVO',
                received_amount: dto.received_amount,
                id_currency: dto.id_currency,
                prev_balance: prev_balance,
                equivalent_amount: dto.equivalent_amount,
                post_balance: post_balance,
                id_user: id_user,
            });

            // Actualizar el saldo de la cuenta del proyecto
            await projectAccountService.updateProjectAccountBalance(projectAccount.id, post_balance);

            return { message: '¡Transacción POS_ADJ registrada correctamente!' };
        } catch (error: any) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    // * NEG_ADJ *
    // El monto del ajuste negativo incrementa la deuda del cliente con la empresa (númerico negativo)
    // Se crea al momento de registrar un ajuste negativo
    public async createTransactionNegAdj(dto: CreateProjectAccountTransactionDTO, id_user: number) {
        try {

            // Verificar si la cuenta del proyecto existe
            const projectAccountService = new ProjectAccountService();
            const projectAccount = await projectAccountService.getProjectAccountById(dto.id_project_account);
            if (!projectAccount) throw CustomError.notFound('¡La cuenta del proyecto no existe!');

            // Calcular el nuevo saldo de la cuenta del proyecto
            const prev_balance = Number(projectAccount.balance);
            const post_balance = prev_balance - Number(dto.equivalent_amount);

            // Registrar la transacción
            await ProjectAccountTransaction.create({
                id_project_account: projectAccount.id,
                type: 'NEG_ADJ',
                description: dto.description || 'AJUSTE NEGATIVO',
                received_amount: dto.received_amount,
                id_currency: dto.id_currency,
                prev_balance: prev_balance,
                equivalent_amount: dto.equivalent_amount * -1,
                post_balance: post_balance,
                id_user: id_user,
            });

            // Actualizar el saldo de la cuenta del proyecto
            await projectAccountService.updateProjectAccountBalance(projectAccount.id, post_balance);
            return { message: '¡Transacción NEG_ADJ registrada correctamente!' };

        } catch (error: any) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

}