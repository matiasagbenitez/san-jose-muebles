import { Router } from 'express';
import { RoleUserController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class RoleUserRoutes {

    static get routes(): Router {

        const router = Router();

        const controller = new RoleUserController();

        router.get('/', [AuthMiddleware.validateJWT], controller.getAll);
        router.get('/:id', [AuthMiddleware.validateJWT], controller.getById);
        router.post('/', [AuthMiddleware.validateJWT], controller.create);
        router.delete('/:id', [AuthMiddleware.validateJWT], controller.delete);

        return router;
    }

}