import { Router } from 'express';
import { DesignController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class DesignRoutes {

    static get routes(): Router {

        const router = Router();

        const controller = new DesignController();

        router.get('/:id', [AuthMiddleware.validateJWT], controller.getById);
        router.patch('/:id/status', [AuthMiddleware.validateJWT], controller.updateStatus);

        return router;
    }

}