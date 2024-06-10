import { Router } from 'express';
import { DesignController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class DesignRoutes {

    static get routes(): Router {

        const router = Router();

        const controller = new DesignController();

        router.get('/paginated', [AuthMiddleware.validateJWT], controller.getAllPaginated);
        router.get('/:id', [AuthMiddleware.validateJWT], controller.getById);
        router.patch('/:id/status', [AuthMiddleware.validateJWT], controller.updateStatus);
        router.get('/:id/evolutions', [AuthMiddleware.validateJWT], controller.getEvolutions);
        router.get('/:id/task/:id_task/evolutions', [AuthMiddleware.validateJWT], controller.getTaskEvolutions);

        return router;
    }

}