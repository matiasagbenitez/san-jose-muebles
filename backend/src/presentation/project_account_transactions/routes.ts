import { Router } from 'express';
import { ProjectAccountTransactionController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class ProjectAccountTransactionRoutes {

    static get routes(): Router {

        const router = Router();

        const controller = new ProjectAccountTransactionController();

        router.get('/:id_project_account/paginated', [AuthMiddleware.validateJWT], controller.getTransactionsByAccountPaginated);

        router.post('/new-movement', [AuthMiddleware.validateJWT], controller.addNewMovement);

        router.get('/:id', [AuthMiddleware.validateJWT], controller.getTransaction);

        router.post('/nullify/:id', [AuthMiddleware.validateJWT], controller.deleteSupplierPayment);

        return router;
    }

}