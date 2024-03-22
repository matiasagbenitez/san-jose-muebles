import { Router } from 'express';
import { PurchaseController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class PurchaseRoutes {

    static get routes(): Router {

        const router = Router(); 

        const controller = new PurchaseController();

        router.get('/', [AuthMiddleware.validateJWT], controller.getAll);
        router.get('/paginated', [AuthMiddleware.validateJWT], controller.getAllPaginated);
        router.get('/:id', [AuthMiddleware.validateJWT], controller.getById);
        router.post('/', [AuthMiddleware.validateJWT], controller.create);
        router.post('/:id_purchase/update-item-stock/:id_item', [AuthMiddleware.validateJWT], controller.updateReceivedStock);
        router.post('/:id_purchase/update-full-stock', [AuthMiddleware.validateJWT], controller.updatePurchaseFullStock);

        router.post('/:id/nullify', [AuthMiddleware.validateJWT], controller.nullifyPurchase);  
        router.get('/:id/receptions', [AuthMiddleware.validateJWT], controller.getReceptions);  

        return router;
    }

}