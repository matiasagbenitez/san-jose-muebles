import { Router } from 'express';
import { SupplierAccountTransactionController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class SupplierAccountTransactionRoutes {

    static get routes(): Router {

        const router = Router();

        const controller = new SupplierAccountTransactionController();

        router.get('/:id_supplier_account', [AuthMiddleware.validateJWT], controller.getByAccount);

        return router;
    }

}