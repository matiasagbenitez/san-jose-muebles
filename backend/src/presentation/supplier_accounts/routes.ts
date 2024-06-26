import { Router } from 'express';
import { SupplierAccountController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class SupplierAccountRoutes {

    static get routes(): Router {

        const router = Router();

        const controller = new SupplierAccountController();

        router.get('/paginated', [AuthMiddleware.validateJWT], controller.getAllPaginated);
        router.get('/supplier/:id_supplier', [AuthMiddleware.validateJWT], controller.getBySupplier);

        router.get('/supplier/:id_supplier/account/:id_supplier_account', [AuthMiddleware.validateJWT], controller.getDataById);

        router.get('/by-currency/:id_currency', [AuthMiddleware.validateJWT], controller.getByCurrency);

        router.post('/', [AuthMiddleware.validateJWT], controller.create);

        return router;
    }

}