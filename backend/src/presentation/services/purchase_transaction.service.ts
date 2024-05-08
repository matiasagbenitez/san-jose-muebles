import { CustomError } from "../../domain";
import { PurchaseTransaction } from "../../database/mysql/models";
import { Transaction } from "sequelize";

interface Params {
    id_purchase: number;
    id_supplier_account_transaction: number;
}

export class PurchaseTransactionService {

    // !DELETEABLE
    public async createPurchaseTransaction(data: Params, transaction: Transaction): Promise<{ transaction: PurchaseTransaction, message: string }> {
        try {
            const item = await PurchaseTransaction.create({
                id_purchase: data.id_purchase,
                id_supplier_account_transaction: data.id_supplier_account_transaction,
            }, { transaction });

            if (!item) throw CustomError.internalServerError('¡Error al registrar purchase_transaction!');
            return { transaction: item, message: '¡Registro de purchase_transaction exitoso!' };

        } catch (error: any) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

}