import { CustomError } from "../../domain";
import { PurchaseTransaction } from "../../database/mysql/models";

interface Params {
    id_purchase: number;
    id_supplier_account_transaction: number;
}

export class PurchaseTransactionService {

    public async createPurchaseTransaction(data: Params) {
        try {
            const item = await PurchaseTransaction.create({
                id_purchase: data.id_purchase,
                id_supplier_account_transaction: data.id_supplier_account_transaction,
            });

            if (!item) throw CustomError.internalServerError('¡Error al registrar purchase_transaction!');
            return { transaction: item, message: '¡Registro de purchase_transaction exitoso!' };

        } catch (error: any) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

}