import { Router } from 'express';
import { SupplierAccountController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class SupplierAccountRoutes {

    static get routes(): Router {

        const router = Router();

        const controller = new SupplierAccountController();

        router.get('/supplier/:id_supplier', [AuthMiddleware.validateJWT], controller.getBySupplier);
        router.post('/', [AuthMiddleware.validateJWT], controller.create);

        return router;
    }

}