import { CustomError } from "../../domain";
import { SupplierAccountTransaction } from "../../database/mysql/models";

interface DataInterface {
    id_supplier_account: number;
    id_purchase: number;
    date: Date;
    amount: number;
    balance: number;
    id_user: number;
}

export class SupplierAccountTransactionService {

    public async getTransactionsFromAccount(id_supplier_account: number) {
        try {
            const rows = await SupplierAccountTransaction.findAll({
                where: { id_supplier_account },
                include: [
                    {
                        association: 'user',
                        attributes: ['name'],
                    },
                    {
                        association: 'purchase_transaction',
                        attributes: ['id_purchase'],
                    },
                ],
                attributes: { exclude: ['id_user', 'updatedAt'] },
            });
            console.log(rows);
            return rows;
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async createInTransactionFromPurchase(data: DataInterface) {
        try {
            const item = await SupplierAccountTransaction.create({
                id_supplier_account: data.id_supplier_account,
                date: data.date,
                isCancellation: false,
                description: 'COMPRA DE PRODUCTOS N° ' + data.id_purchase,
                amount_in: data.amount,
                amount_out: 0,
                balance: data.balance,
                id_user: data.id_user,
            });
            if (!item) throw CustomError.internalServerError('¡Error al registrar la transacción de compra!');
            return { transaction: item, message: '¡Transacción de compra registrada correctamente!' };
        } catch (error: any) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async createOutTransactionFromPurchase(data: DataInterface): Promise<SupplierAccountTransaction> {
        try {
            const item = await SupplierAccountTransaction.create({
                id_supplier_account: data.id_supplier_account,
                date: data.date,
                isCancellation: true,
                description: 'ANULACIÓN DE COMPRA N° ' + data.id_purchase,
                amount_in: 0,
                amount_out: data.amount,
                balance: data.balance,
                id_user: data.id_user,
            });
            if (!item) throw CustomError.internalServerError('¡Error al registrar la transacción de compra!');
            return item;
        } catch (error: any) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

}