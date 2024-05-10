import { CustomError, PaginationDto, ProjectAccountTransactionEntity, CreateProjectAccountTransactionDTO } from "../../domain";
import { ProjectAccount, ProjectAccountTransaction } from "../../database/mysql/models";

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
        const transaction = await ProjectAccount.sequelize!.transaction();
        if (!transaction) throw CustomError.internalServerError('¡Error al crear la transacción!');

        try {
            const projectAccount = await ProjectAccount.findByPk(dto.id_project_account);
            if (!projectAccount) throw CustomError.notFound('¡La cuenta del proyecto no existe!');

            // Calcular el nuevo saldo de la cuenta del proyecto
            const prev_balance = Number(projectAccount.balance);
            const post_balance = prev_balance + Number(dto.equivalent_amount);

            // Registrar la transacción
            await ProjectAccountTransaction.create({
                id_project_account: projectAccount.id,
                type: 'NEW_PAYMENT',
                description: dto.description,
                received_amount: dto.received_amount,
                id_currency: dto.id_currency,
                prev_balance: prev_balance,
                equivalent_amount: dto.equivalent_amount,
                post_balance: post_balance,
                id_user: id_user,
            }, { transaction });

            // Actualizar el saldo de la cuenta del proyecto
            await projectAccount.update({ balance: post_balance }, { transaction });
            await transaction.commit();

            return { message: '¡Transacción PAGO DE CLIENTE registrada correctamente!' };
        } catch (error: any) {
            await transaction.rollback();
            const errorMessages: Record<string, string> = {
                SequelizeValidationError: 'Ocurrió un error de VALIDACIÓN al crear el pago del cliente',
                SequelizeDatabaseError: 'Ocurrió un error de BASE DE DATOS al crear el pago del cliente',
                SequelizeUniqueConstraintError: 'Ocurrió un error de CONFLICTO al crear el pago del cliente',
                SequelizeForeignKeyConstraintError: 'Ocurrió un error de REFERENCIA al crear el pago del cliente',
            };

            const errorMessage = errorMessages[error.name] || 'Ocurrió un error desconocido al crear el pago del cliente';
            throw CustomError.internalServerError(errorMessage);
        }
    }

    // * POS_ADJ *
    // El monto del ajuste positivo disminuye la deuda del cliente con la empresa (númerico positivo)
    // Se crea al momento de registrar un ajuste positivo
    public async createTransactionPosAdj(dto: CreateProjectAccountTransactionDTO, id_user: number) {

        const transaction = await ProjectAccount.sequelize!.transaction();
        if (!transaction) throw CustomError.internalServerError('¡Error al crear la transacción!');

        try {
            // Verificar si la cuenta del proyecto existe
            const projectAccount = await ProjectAccount.findByPk(dto.id_project_account);
            if (!projectAccount) throw CustomError.notFound('¡La cuenta del proyecto no existe!');

            // Calcular el nuevo saldo de la cuenta del proyecto
            const prev_balance = Number(projectAccount.balance);
            const post_balance = prev_balance + Number(dto.equivalent_amount);

            // Registrar la transacción
            await ProjectAccountTransaction.create({
                id_project_account: projectAccount.id,
                type: 'POS_ADJ',
                description: dto.description,
                received_amount: dto.received_amount,
                id_currency: dto.id_currency,
                prev_balance: prev_balance,
                equivalent_amount: dto.equivalent_amount,
                post_balance: post_balance,
                id_user: id_user,
            }, { transaction });

            // Actualizar el saldo de la cuenta del proyecto
            await projectAccount.update({ balance: post_balance }, { transaction });
            await transaction.commit();

            return { message: '¡Transacción AJUSTE POSITIVO registrada correctamente!' };
        } catch (error: any) {
            await transaction.rollback();
            const errorMessages: Record<string, string> = {
                SequelizeValidationError: 'Ocurrió un error de VALIDACIÓN al crear el ajuste positivo',
                SequelizeDatabaseError: 'Ocurrió un error de BASE DE DATOS al crear el ajuste positivo',
                SequelizeUniqueConstraintError: 'Ocurrió un error de CONFLICTO al crear el ajuste positivo',
                SequelizeForeignKeyConstraintError: 'Ocurrió un error de REFERENCIA al crear el ajuste positivo',
            };

            const errorMessage = errorMessages[error.name] || 'Ocurrió un error desconocido al crear el ajuste positivo';
            throw CustomError.internalServerError(errorMessage);
        }
    }

    // * NEG_ADJ *
    // El monto del ajuste negativo incrementa la deuda del cliente con la empresa (númerico negativo)
    // Se crea al momento de registrar un ajuste negativo
    public async createTransactionNegAdj(dto: CreateProjectAccountTransactionDTO, id_user: number) {

        const transaction = await ProjectAccount.sequelize!.transaction();
        if (!transaction) throw CustomError.internalServerError('¡Error al crear la transacción!');

        try {

            // Verificar si la cuenta del proyecto existe
            const projectAccount = await ProjectAccount.findByPk(dto.id_project_account);
            if (!projectAccount) throw CustomError.notFound('¡La cuenta del proyecto no existe!');

            // Calcular el nuevo saldo de la cuenta del proyecto
            const prev_balance = Number(projectAccount.balance);
            const post_balance = prev_balance - Number(dto.equivalent_amount);

            // Registrar la transacción
            await ProjectAccountTransaction.create({
                id_project_account: projectAccount.id,
                type: 'NEG_ADJ',
                description: dto.description,
                received_amount: dto.received_amount,
                id_currency: dto.id_currency,
                prev_balance: prev_balance,
                equivalent_amount: dto.equivalent_amount * -1,
                post_balance: post_balance,
                id_user: id_user,
            });

            // Actualizar el saldo de la cuenta del proyecto
            await projectAccount.update({ balance: post_balance }, { transaction });
            await transaction.commit();

            return { message: '¡Transacción AJUSTE NEGATIVO registrada correctamente!' };

        } catch (error: any) {
            await transaction.rollback();
            const errorMessages: Record<string, string> = {
                SequelizeValidationError: 'Ocurrió un error de VALIDACIÓN al crear el ajuste negativo',
                SequelizeDatabaseError: 'Ocurrió un error de BASE DE DATOS al crear el ajuste negativo',
                SequelizeUniqueConstraintError: 'Ocurrió un error de CONFLICTO al crear el ajuste negativo',
                SequelizeForeignKeyConstraintError: 'Ocurrió un error de REFERENCIA al crear el ajuste negativo',
            };

            const errorMessage = errorMessages[error.name] || 'Ocurrió un error desconocido al crear el ajuste negativo';
            throw CustomError.internalServerError(errorMessage);
        }
    }

}