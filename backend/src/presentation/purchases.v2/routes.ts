import { Router } from 'express';
import { PurchaseV2Controller } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class PurchaseV2Routes {

    static get routes(): Router {

        const router = Router(); 

        const controller = new PurchaseV2Controller();
;
        router.get('/:id', [AuthMiddleware.validateJWT], controller.getById);
        router.get('/by-supplier/:id_supplier/paginated', [AuthMiddleware.validateJWT], controller.getPurchasesBySupplierId);
        router.post('/', [AuthMiddleware.validateJWT], controller.create);

        router.post('/:id/nullify', [AuthMiddleware.validateJWT], controller.nullifyPurchase);  

        return router;
    }

}