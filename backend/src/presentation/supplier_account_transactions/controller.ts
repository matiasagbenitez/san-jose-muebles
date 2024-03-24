import { Request, Response } from "express";
import { CustomError } from "../../domain";
import { SupplierAccountTransactionService } from '../services/supplier_account_transaction.service';

export class SupplierAccountTransactionController {

    protected service: SupplierAccountTransactionService = new SupplierAccountTransactionService();

    private handleError(error: unknown, res: Response) {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }

    // Métodos de la clase
    getByAccount = async (req: Request, res: Response) => {
        const id_supplier_account = parseInt(req.params.id_supplier_account);
        if (!id_supplier_account) return res.status(400).json({ message: 'Missing id_supplier_account' });

        this.service.getTransactionsFromAccount(id_supplier_account)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

}