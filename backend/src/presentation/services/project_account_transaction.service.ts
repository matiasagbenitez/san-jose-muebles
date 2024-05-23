import { CustomError, PaginationDto, ProjectAccountTransactionEntity, ProjectTransactionDetailEntity, CreateProjectAccountTransactionDTO } from "../../domain";
import { ProjectAccount, ProjectAccountTransaction, ProjectSupplierTransaction, SupplierAccount, SupplierAccountTransaction } from "../../database/mysql/models";

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
                    { association: 'currency', attributes: ['name', 'symbol', 'is_monetary'] },
                    {
                        association: 'project_supplier_transaction',
                        include: [
                            {
                                association: 'supplier_transaction', include: [
                                    {
                                        association: 'account', include: [
                                            {
                                                association: 'supplier', attributes: ['id', 'name']
                                            }
                                        ]
                                    }
                                ]
                            },
                        ],
                    },
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

    // * GET TRANSACTION BY ID *
    // Obtiene una transacción por su ID
    public async getTransactionById(ids: [number, number, number]) {
        const [id_project, id_project_account, id] = ids;
        try {
            const account = await ProjectAccount.findOne({ where: { id: id_project_account, id_project: id_project } });
            if (!account) throw CustomError.notFound('¡La cuenta del proyecto no existe!');

            const transaction = await ProjectAccountTransaction.findByPk(id, {
                include: [
                    {
                        association: 'account', include: [
                            {
                                association: 'project', include: [
                                    { association: 'client', attributes: ['name', 'last_name'] },
                                    { association: 'locality', attributes: ['name'] },
                                ]
                            },
                            { association: 'currency', attributes: ['name', 'symbol', 'is_monetary'] }
                        ]
                    },
                    { association: 'user', attributes: ['name'] },
                    { association: 'currency', attributes: ['name', 'symbol', 'is_monetary'] }
                ],
            });
            if (!transaction) throw CustomError.notFound('¡La transacción no existe!');
            if (transaction.id_project_account !== id_project_account) throw CustomError.forbidden('¡La transacción no pertenece a la cuenta del proyecto!');
            
            const entity = ProjectTransactionDetailEntity.fromObject(transaction);

            return { item: entity }
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

    // * NEW_SUPPLIER_PAYMENT *
    // El monto del pago disminuye la deuda del cliente con la empresa (númerico positivo)
    // Se crea al momento de registrar un pago por parte de un cliente al proveedor
    public async createTransactionNewSupplierPayment(dto: CreateProjectAccountTransactionDTO, id_user: number) {
        const transaction = await ProjectAccount.sequelize!.transaction();
        if (!transaction) throw CustomError.internalServerError('¡Error al crear la transacción!');

        try {
            const projectAccount = await ProjectAccount.findByPk(dto.id_project_account);
            if (!projectAccount) throw CustomError.notFound('¡La cuenta del proyecto no existe!');

            // Calcular el nuevo saldo de la cuenta del proyecto
            const prev_balance = Number(projectAccount.balance);
            const post_balance = prev_balance + Number(dto.equivalent_amount);

            // Registrar la transacción
            const project_transaction = await ProjectAccountTransaction.create({
                id_project_account: projectAccount.id,
                type: 'NEW_SUPPLIER_PAYMENT',
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

            // Buscar la cuenta del proveedor
            const supplierAccount = await SupplierAccount.findByPk(dto.id_supplier_account);
            if (!supplierAccount) throw CustomError.notFound('¡La cuenta del proveedor no existe!');

            // Calcular el nuevo saldo de la cuenta del proveedor
            const prev_supplier_balance = Number(supplierAccount.balance);
            const post_supplier_balance = prev_supplier_balance + Number(dto.received_amount);

            // Registrar la transacción
            const supplier_transaction = await SupplierAccountTransaction.create({
                id_supplier_account: supplierAccount.id,
                type: 'NEW_CLIENT_PAYMENT',
                description: 'PAGO DE CLIENTE A PROVEEDOR N° ' + project_transaction.id,
                prev_balance: prev_supplier_balance,
                amount: dto.received_amount,
                post_balance: post_supplier_balance,
                id_user: id_user,
            }, { transaction });

            // Actualizar el saldo de la cuenta del proveedor
            await supplierAccount.update({ balance: post_supplier_balance }, { transaction });

            // Crear transacción de pago de cliente a proveedor
            await ProjectSupplierTransaction.create({
                id_project_account_transaction: project_transaction.id,
                id_supplier_account_transaction: supplier_transaction.id,
            }, { transaction });

            await transaction.commit();

            return { message: '¡Transacción PAGO DE CLIENTE A PROVEEDOR registrada correctamente!' };
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