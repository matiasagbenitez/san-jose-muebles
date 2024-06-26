import { CustomError, PaginationDto, SupplierAccountTransactionEntity, SupplierTransactionDetailEntity, TransactionDto } from "../../domain";
import { SupplierAccount, SupplierAccountTransaction } from "../../database/mysql/models";
import { SupplierAccountService } from "./supplier_account.service";
import { Transaction } from "sequelize";

interface DataInterface {
    id_supplier_account: number;
    id_purchase: number;
    description?: string;
    prev_balance: number;
    amount: number;
    post_balance: number;
    id_user: number;
}

export class SupplierAccountTransactionService {

    // * GET TRANSACTIONS BY ACCOUNT (PAGINATED) *
    // Obtiene las transacciones de una cuenta corriente paginadas
    public async getTransactionsByAccountPaginated(paginationDto: PaginationDto, id: number) {
        try {
            const { page, limit } = paginationDto;

            const transactions = await SupplierAccountTransaction.findAndCountAll({
                where: { id_supplier_account: id },
                include: [
                    { association: 'user', attributes: ['name'] },
                    { association: 'purchase_transaction' },
                    {
                        association: 'project_supplier_transaction',
                        include: [
                            {
                                association: 'project_transaction', include: [
                                    {
                                        association: 'account', include: [
                                            {
                                                association: 'project', include: [
                                                    {
                                                        association: 'client'
                                                    }
                                                ]
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

            const items = transactions.rows.map(item => SupplierAccountTransactionEntity.fromObject(item));

            return { items: items, total_items: transactions.count };
        } catch (error: any) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    // * GET TRANSACTION BY ID *
    // Obtiene una transacción por su ID
    public async getTransactionById(ids: [number, number, number]) {
        const [id_supplier, id_supplier_account, id] = ids;
        try {

            const account = await SupplierAccount.findOne({ where: { id: id_supplier_account, id_supplier: id_supplier } });
            if (!account) throw CustomError.notFound('¡La cuenta del proveedor no existe!');

            const transaction = await SupplierAccountTransaction.findByPk(id, {
                include: [
                    {
                        association: 'account', include: [
                            { association: 'currency', attributes: ['name', 'symbol', 'is_monetary'] },
                            { association: 'supplier', include: [
                                    { association: 'locality', attributes: ['name'], include: [{ association: 'province', attributes: ['name'] }] }
                                ]
                            },
                            { association: 'currency', attributes: ['name', 'symbol', 'is_monetary'] }
                        ]
                    },
                    { association: 'user', attributes: ['name'] },
                ],
            });
            if (!transaction) throw CustomError.notFound('¡La transacción no existe!');
            if (transaction.id_supplier_account !== id_supplier_account) throw CustomError.notFound('¡La transacción no pertenece a la cuenta del proveedor!');

            const entity = SupplierTransactionDetailEntity.fromObject(transaction);

            return { item: entity }
        } catch (error: any) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    // * NEW_PURCHASE *
    // El monto de la compra incrementa la deuda con el proveedor (númerico negativo)
    // Se crea al momento de registrar una compra
    public async createTransactionNewPurchase(data: DataInterface, transaction: Transaction) {
        try {
            const item = await SupplierAccountTransaction.create({
                id_supplier_account: data.id_supplier_account,
                type: 'NEW_PURCHASE',
                description: 'COMPRA DE PRODUCTOS ID: ' + data.id_purchase,
                prev_balance: data.prev_balance,
                amount: data.amount * -1,
                post_balance: data.post_balance,
                id_user: data.id_user,
            }, { transaction });

            if (!item) throw CustomError.internalServerError('¡Error al registrar la transacción!');
            return { transaction: item, message: '¡Transacción registrada correctamente!' };
        } catch (error: any) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    // * DEL_PURCHASE *
    // El monto de la compra decrementa la deuda con el proveedor (númerico positivo)
    // Se crea al momento de anular una compra
    public async createTransactionDelPurchase(data: DataInterface, transaction: Transaction) {
        try {
            const item = await SupplierAccountTransaction.create({
                id_supplier_account: data.id_supplier_account,
                type: 'DEL_PURCHASE',
                description: 'ANULACIÓN DE COMPRA ID: ' + data.id_purchase,
                prev_balance: data.prev_balance,
                amount: data.amount,
                post_balance: data.post_balance,
                id_user: data.id_user,
            }, { transaction });
            if (!item) throw CustomError.internalServerError('¡Error al registrar la transacción!');
            return { transaction: item, message: '¡Transacción registrada correctamente!' };
        } catch (error: any) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    // * NEW_PAYMENT *
    // El monto del pago disminuye la deuda con el proveedor (númerico positivo)
    // Se crea al momento de registrar un pago por parte de la empresa
    public async createTransactionNewPayment(data: TransactionDto, id_user: number) {

        const transaction = await SupplierAccountTransaction.sequelize!.transaction();
        if (!transaction) throw CustomError.internalServerError('¡No se pudo iniciar la transacción!');

        try {

            // Verificar si la cuenta del proveedor existe
            const supplierAccount = await SupplierAccount.findByPk(data.id_supplier_account);
            if (!supplierAccount) throw CustomError.notFound('¡No se encontró la cuenta corriente del proveedor!');

            // Calcular el nuevo saldo de la cuenta del proveedor
            const prev_balance = Number(supplierAccount.balance);
            const post_balance = prev_balance + Number(data.amount);

            // Registrar la transacción
            await SupplierAccountTransaction.create({
                id_supplier_account: supplierAccount.id,
                type: 'NEW_PAYMENT',
                description: data.description,
                prev_balance: prev_balance,
                amount: data.amount,
                post_balance: post_balance,
                id_user: id_user,
            }, { transaction });

            // Actualizar el saldo de la cuenta del proveedor
            await supplierAccount.update({ balance: post_balance }, { transaction });

            await transaction.commit();

            return { message: '¡Transacción PAGO PROPIO registrada correctamente!' };
        } catch (error: any) {
            await transaction.rollback();
            throw CustomError.internalServerError(`${error}`);
        }
    }

    // * POS_ADJ *
    // El monto del ajuste positivo disminuye la deuda con el proveedor (númerico positivo)
    // Se crea al momento de registrar un ajuste positivo
    public async createTransactionPosAdj(data: TransactionDto, id_user: number) {

        const transaction = await SupplierAccountTransaction.sequelize!.transaction();
        if (!transaction) throw CustomError.internalServerError('¡No se pudo iniciar la transacción!');

        try {

            // Verificar si la cuenta del proveedor existe
            const supplierAccount = await SupplierAccount.findByPk(data.id_supplier_account);
            if (!supplierAccount) throw CustomError.notFound('¡La cuenta del proveedor no existe!');

            // Calcular el nuevo saldo de la cuenta del proveedor
            const prev_balance = Number(supplierAccount.balance);
            const post_balance = prev_balance + Number(data.amount);

            // Registrar la transacción
            await SupplierAccountTransaction.create({
                id_supplier_account: supplierAccount.id,
                type: 'POS_ADJ',
                description: data.description,
                prev_balance: prev_balance,
                amount: data.amount,
                post_balance: post_balance,
                id_user: id_user,
            }, { transaction });

            // Actualizar el saldo de la cuenta del proveedor
            await supplierAccount.update({ balance: post_balance }, { transaction });

            await transaction.commit();

            return { ok: true, message: '¡Transacción AJUSTE A FAVOR registrada correctamente!' };
        } catch (error: any) {
            await transaction.rollback();
            throw CustomError.internalServerError(`${error}`);
        }
    }

    // * NEG_ADJ *
    // El monto del ajuste negativo incrementa la deuda con el proveedor (númerico negativo)
    // Se crea al momento de registrar un ajuste negativo
    public async createTransactionNegAdj(data: TransactionDto, id_user: number) {

        const transaction = await SupplierAccountTransaction.sequelize!.transaction();
        if (!transaction) throw CustomError.internalServerError('¡No se pudo iniciar la transacción!');

        try {

            // Verificar si la cuenta del proveedor existe
            const supplierAccount = await SupplierAccount.findByPk(data.id_supplier_account);
            if (!supplierAccount) throw CustomError.notFound('¡La cuenta del proveedor no existe!');

            // Calcular el nuevo saldo de la cuenta del proveedor
            const prev_balance = Number(supplierAccount.balance);
            const post_balance = prev_balance - Number(data.amount);

            // Registrar la transacción
            await SupplierAccountTransaction.create({
                id_supplier_account: supplierAccount.id,
                type: 'NEG_ADJ',
                description: data.description,
                prev_balance: prev_balance,
                amount: data.amount * -1,
                post_balance: post_balance,
                id_user: id_user,
            }, { transaction });

            // Actualizar el saldo de la cuenta del proveedor
            await supplierAccount.update({ balance: post_balance }, { transaction });

            await transaction.commit();

            return { message: '¡Transacción AJUSTE EN CONTRA registrada correctamente!' };
        } catch (error: any) {
            await transaction.rollback();
            throw CustomError.internalServerError(`${error}`);
        }
    }

}