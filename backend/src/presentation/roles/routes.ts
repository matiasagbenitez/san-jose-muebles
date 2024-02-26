import { Router } from 'express';
import { RoleController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class RoleRoutes {

    static get routes(): Router {

        const router = Router();

        const controller = new RoleController();

        router.get('/', [AuthMiddleware.validateJWT], controller.getAll);
        router.get('/:id', [AuthMiddleware.validateJWT], controller.getById);
        router.post('/', [AuthMiddleware.validateJWT], controller.create);
        router.put('/:id', [AuthMiddleware.validateJWT], controller.update);
        router.delete('/:id', [AuthMiddleware.validateJWT], controller.delete);

        return router;
    }

}