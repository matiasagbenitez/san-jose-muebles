import { CustomError, DelInDto, TransactionDto } from "../../domain";
import { SupplierAccountTransaction } from "../../database/mysql/models";
import { SupplierAccountService } from "./supplier_account.service";

// ! --- TYPES ---
// NEW_PURCHASE: Nueva compra (valor negativo, aumenta deuda) -> se crea al momento de registrar una compra
// DEL_PURCHASE: Anulación de compra (valor positivo, disminuye deuda) -> se crea al momento de anular una compra

// NEW_PAYMENT: Nuevo pago de empresa a proveedor (valor positivo, disminuye deuda) -> se crea al momento de registrar un pago de empresa a proveedor
// POS_ADJ: Ajuste positivo (valor positivo, disminuye deuda) -> se crea al momento de registrar un ajuste positivo
// NEG_ADJ: Ajuste negativo (valor negativo, aumenta deuda) -> se crea al momento de registrar un ajuste negativo

// NEW_CLIENT_PAYMENT: Nuevo pago de cliente a proveedor (valor positivo, disminuye deuda) -> se crea al momento de registrar un pago de cliente a proveedor
// DEL_CLIENT_PAYMENT: Anulación de pago de cliente a proveedor (valor negativo, aumenta deuda) -> se crea al momento de anular un pago de cliente a proveedor

// ! --- TYPES ---

interface DataInterface {
    id_supplier_account: number;
    id_purchase: number;
    description?: string;
    prev_balance: number;
    amount: number;
    post_balance: number;
    id_user: number;
}

interface MovementInterface {
    id_supplier_account: number;
    type: string;
    description: string;
    amount: number;
}

export class SupplierAccountTransactionService {

    // * NEW_PURCHASE *
    // El monto de la compra incrementa la deuda con el proveedor (númerico negativo)
    // Se crea al momento de registrar una compra
    public async createTransactionNewPurchase(data: DataInterface) {
        try {
            const item = await SupplierAccountTransaction.create({
                id_supplier_account: data.id_supplier_account,
                type: 'NEW_PURCHASE',
                description: 'COMPRA DE PRODUCTOS N° ' + data.id_purchase,
                prev_balance: data.prev_balance,
                amount: data.amount * -1,
                post_balance: data.post_balance,
                id_user: data.id_user,
            });
            if (!item) throw CustomError.internalServerError('¡Error al registrar la transacción!');
            return { transaction: item, message: '¡Transacción registrada correctamente!' };
        } catch (error: any) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    // * DEL_PURCHASE *
    // El monto de la compra decrementa la deuda con el proveedor (númerico positivo)
    // Se crea al momento de anular una compra
    public async createTransactionDelPurchase(data: DataInterface) {
        try {
            const item = await SupplierAccountTransaction.create({
                id_supplier_account: data.id_supplier_account,
                type: 'DEL_PURCHASE',
                description: 'COMPRA N° ' + data.id_purchase + ' ANULADA',
                prev_balance: data.prev_balance,
                amount: data.amount,
                post_balance: data.post_balance,
                id_user: data.id_user,
            });
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
        try {

            // Verificar si la cuenta del proveedor existe
            const supplierAccountService = new SupplierAccountService();
            const supplierAccount = await supplierAccountService.getSupplierAccountById(data.id_supplier_account);
            if (!supplierAccount) throw CustomError.notFound('¡La cuenta del proveedor no existe!');

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
            });

            // Actualizar el saldo de la cuenta del proveedor
            await supplierAccountService.updateSupplierAccountBalance(supplierAccount.id, post_balance);

            return { message: '¡Transacción NEW_PAYMENT registrada correctamente!' };
        } catch (error: any) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    // * POS_ADJ *
    // El monto del ajuste positivo disminuye la deuda con el proveedor (númerico positivo)
    // Se crea al momento de registrar un ajuste positivo
    public async createTransactionPosAdj(data: TransactionDto, id_user: number) {
        try {

            // Verificar si la cuenta del proveedor existe
            const supplierAccountService = new SupplierAccountService();
            const supplierAccount = await supplierAccountService.getSupplierAccountById(data.id_supplier_account);
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
            });

            // Actualizar el saldo de la cuenta del proveedor
            await supplierAccountService.updateSupplierAccountBalance(supplierAccount.id, post_balance);

            return { message: '¡Transacción POS_ADJ registrada correctamente!' };
        } catch (error: any) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    // * NEG_ADJ *
    // El monto del ajuste negativo incrementa la deuda con el proveedor (númerico negativo)
    // Se crea al momento de registrar un ajuste negativo
    public async createTransactionNegAdj(data: TransactionDto, id_user: number) {
        try {

            // Verificar si la cuenta del proveedor existe
            const supplierAccountService = new SupplierAccountService();
            const supplierAccount = await supplierAccountService.getSupplierAccountById(data.id_supplier_account);
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
            });

            // Actualizar el saldo de la cuenta del proveedor
            await supplierAccountService.updateSupplierAccountBalance(supplierAccount.id, post_balance);
            return { message: '¡Transacción NEG_ADJ registrada correctamente!' };

        } catch (error: any) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

}