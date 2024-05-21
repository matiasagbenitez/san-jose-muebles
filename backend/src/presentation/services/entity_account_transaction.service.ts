import { CustomError, PaginationDto, EntityAccountTransactionEntity, EntityTransactionDetailEntity, CreateEntityTransactionDTO } from "../../domain";
import { EntityAccount, EntityAccountTransaction } from "../../database/mysql/models";
import { Transaction } from "sequelize";



export class EntityAccountTransactionService {

    // * GET TRANSACTIONS BY ACCOUNT (PAGINATED) *
    // Obtiene las transacciones de una cuenta corriente paginadas
    public async getTransactionsByAccountPaginated(paginationDto: PaginationDto, id: number) {
        try {
            const { page, limit } = paginationDto;

            const transactions = await EntityAccountTransaction.findAndCountAll({
                where: { id_entity_account: id },
                include: [
                    { association: 'user', attributes: ['name'] },
                ],
                order: [['createdAt', 'DESC']],
                offset: (page - 1) * limit,
                limit: limit,
            });

            const items = transactions.rows.map(item => EntityAccountTransactionEntity.fromObject(item));

            return { items: items, total_items: transactions.count };
        } catch (error: any) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    // * GET TRANSACTION BY ID *
    // Obtiene una transacción por su ID
    public async getTransactionById(id: number) {
        try {
            const transaction = await EntityAccountTransaction.findByPk(id, {
                include: [
                    {
                        association: 'account', include: [
                            { association: 'currency', attributes: ['id', 'name', 'symbol', 'is_monetary'] },
                            {
                                association: 'entity', include: [
                                    { association: 'locality', attributes: ['name'], include: [{ association: 'province', attributes: ['name'] }] }
                                ]
                            },
                        ]
                    },
                    { association: 'user', attributes: ['name'] },
                ],
            });
            if (!transaction) throw CustomError.notFound('¡La transacción no existe!');
            const entity = EntityTransactionDetailEntity.fromObject(transaction);

            return { item: entity }
        } catch (error: any) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    // * PAYMENT *
    // El monto del pago disminuye la deuda con la entidad (númerico positivo)
    // Se crea al momento de registrar un pago/abono por parte de la empresa
    public async createTransactionNewPayment(data: CreateEntityTransactionDTO) {
        const transaction = await EntityAccountTransaction.sequelize!.transaction();
        if (!transaction) throw CustomError.internalServerError('¡No se pudo iniciar la transacción!');

        try {
            // Verificar si la cuenta de la entidad existe
            const entityAccount = await EntityAccount.findByPk(data.id_entity_account);
            if (!entityAccount) throw CustomError.notFound('¡No se encontró la cuenta corriente de la entidad!');

            // Calcular el nuevo saldo de la cuenta de la entidad
            const prev_balance = Number(entityAccount.balance);
            const post_balance = prev_balance + Number(data.amount);

            // Registrar la transacción
            await EntityAccountTransaction.create({
                id_entity_account: entityAccount.id,
                type: 'PAYMENT',
                description: data.description,
                prev_balance: prev_balance,
                amount: data.amount,
                post_balance: post_balance,
                id_user: data.id_user,
            }, { transaction });

            // Actualizar el saldo de la cuenta del d
            await entityAccount.update({ balance: post_balance }, { transaction });

            await transaction.commit();

            return { message: '¡Movimento tipo PAGO/ABONO registrado correctamente!' };
        } catch (error: any) {
            await transaction.rollback();
            throw CustomError.internalServerError(`${error}`);
        }
    }
    // * DEBT *
    // El monto ingresado aumenta la deuda con la entidad (númerico negativo)
    // Se crea al momento de registrar una deuda/cargo por parte de la empresa
    public async createTransactionNewDebt(data: CreateEntityTransactionDTO) {
        const transaction = await EntityAccountTransaction.sequelize!.transaction();
        if (!transaction) throw CustomError.internalServerError('¡No se pudo iniciar la transacción!');

        try {
            // Verificar si la cuenta de la entidad existe
            const entityAccount = await EntityAccount.findByPk(data.id_entity_account);
            if (!entityAccount) throw CustomError.notFound('¡No se encontró la cuenta corriente de la entidad!');

            // Calcular el nuevo saldo de la cuenta de la entidad
            const prev_balance = Number(entityAccount.balance);
            const post_balance = prev_balance - Number(data.amount);

            // Registrar la transacción
            await EntityAccountTransaction.create({
                id_entity_account: entityAccount.id,
                type: 'DEBT',
                description: data.description,
                prev_balance: prev_balance,
                amount: data.amount * -1,
                post_balance: post_balance,
                id_user: data.id_user,
            }, { transaction });

            // Actualizar el saldo de la cuenta del d
            await entityAccount.update({ balance: post_balance }, { transaction });

            await transaction.commit();

            return { message: '¡Movimento tipo DEUDA/CARGO registrado correctamente!' };
        } catch (error: any) {
            await transaction.rollback();
            throw CustomError.internalServerError(`${error}`);
        }
    }

    // * POS_ADJ *
    // El monto del ajuste positivo disminuye la deuda con la entidad (númerico positivo)
    // Se crea al momento de registrar un ajuste positivo
    public async createTransactionPosAdj(data: CreateEntityTransactionDTO) {

        const transaction = await EntityAccountTransaction.sequelize!.transaction();
        if (!transaction) throw CustomError.internalServerError('¡No se pudo iniciar la transacción!');

        try {

            // Verificar si la cuenta de la entidad existe
            const entityAccount = await EntityAccount.findByPk(data.id_entity_account);
            if (!entityAccount) throw CustomError.notFound('¡La cuenta de la entidad no existe!');

            // Calcular el nuevo saldo de la cuenta de la entidad
            const prev_balance = Number(entityAccount.balance);
            const post_balance = prev_balance + Number(data.amount);

            // Registrar la transacción
            await EntityAccountTransaction.create({
                id_entity_account: entityAccount.id,
                type: 'POS_ADJ',
                description: data.description,
                prev_balance: prev_balance,
                amount: data.amount,
                post_balance: post_balance,
                id_user: data.id_user,
            }, { transaction });

            // Actualizar el saldo de la cuenta de la entidad
            await entityAccount.update({ balance: post_balance }, { transaction });

            await transaction.commit();

            return { ok: true, message: '¡Movimiento tipo AJUSTE A FAVOR registrado correctamente!' };
        } catch (error: any) {
            await transaction.rollback();
            throw CustomError.internalServerError(`${error}`);
        }
    }

    // * NEG_ADJ *
    // El monto del ajuste negativo incrementa la deuda con la entidad (númerico negativo)
    // Se crea al momento de registrar un ajuste negativo
    public async createTransactionNegAdj(data: CreateEntityTransactionDTO) {

        const transaction = await EntityAccountTransaction.sequelize!.transaction();
        if (!transaction) throw CustomError.internalServerError('¡No se pudo iniciar la transacción!');

        try {

            // Verificar si la cuenta de la entidad existe
            const entityAccount = await EntityAccount.findByPk(data.id_entity_account);
            if (!entityAccount) throw CustomError.notFound('¡La cuenta de la entidad no existe!');

            // Calcular el nuevo saldo de la cuenta de la entidad
            const prev_balance = Number(entityAccount.balance);
            const post_balance = prev_balance - Number(data.amount);

            // Registrar la transacción
            await EntityAccountTransaction.create({
                id_entity_account: entityAccount.id,
                type: 'NEG_ADJ',
                description: data.description,
                prev_balance: prev_balance,
                amount: data.amount * -1,
                post_balance: post_balance,
                id_user: data.id_user,
            }, { transaction });

            // Actualizar el saldo de la cuenta de la entidad
            await entityAccount.update({ balance: post_balance }, { transaction });

            await transaction.commit();

            return { message: '¡Movimiento tipo AJUSTE EN CONTRA registrado correctamente!' };
        } catch (error: any) {
            await transaction.rollback();
            throw CustomError.internalServerError(`${error}`);
        }
    }

}