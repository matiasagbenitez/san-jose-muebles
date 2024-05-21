import { Router } from 'express';
import { EntityAccountTransactionController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class EntityAccountTransactionRoutes {

    static get routes(): Router {

        const router = Router();

        const controller = new EntityAccountTransactionController();

        router.get('/:id_supplier_account/paginated', [AuthMiddleware.validateJWT], controller.getTransactionsByAccountPaginated);

        router.post('/new-movement', [AuthMiddleware.validateJWT], controller.addNewMovement);

        router.get('/:id', [AuthMiddleware.validateJWT], controller.getTransaction);
        
        return router;
    }

}