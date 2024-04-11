import { Request, Response } from "express";
import { CustomError, SupplierAccountDto } from "../../domain";
import { SupplierAccountService } from '../services/supplier_account.service';

export class SupplierAccountController {

    protected service: SupplierAccountService = new SupplierAccountService();

    private handleError(error: unknown, res: Response) {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }

    // Métodos de la clase
    getBySupplier = async (req: Request, res: Response) => {
        const id_supplier = parseInt(req.params.id_supplier);
        if (!id_supplier) return res.status(400).json({ message: 'Missing id_supplier' });

        this.service.getAccountsBySupplier(id_supplier)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

    getDataById = async (req: Request, res: Response) => {
        const id_supplier_account = parseInt(req.params.id_supplier_account);
        if (!id_supplier_account) return res.status(400).json({ message: 'Missing id_supplier_account' });

        this.service.getAccountDataById(id_supplier_account)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

    create = async (req: Request, res: Response) => {
        for (let key in req.body) {
            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key].trim();
            }
        }
        const [error, createDto] = SupplierAccountDto.create(req.body);
        if (error) return res.status(400).json({ message: error });

        this.service.createAccount(createDto!)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

}