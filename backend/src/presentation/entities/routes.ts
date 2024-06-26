import { Router } from 'express';
import { EntityController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class EntityRoutes {

    static get routes(): Router {

        const router = Router();

        const controller = new EntityController();

        router.get('/', [AuthMiddleware.validateJWT], controller.getAll);
        router.get('/paginated', [AuthMiddleware.validateJWT], controller.getAllPaginated);
        router.get('/select', [AuthMiddleware.validateJWT], controller.getAllSelect);
        router.get('/:id', [AuthMiddleware.validateJWT], controller.getById);
        router.post('/', [AuthMiddleware.validateJWT], controller.create);
        router.put('/:id', [AuthMiddleware.validateJWT], controller.update);
        router.delete('/:id', [AuthMiddleware.validateJWT], controller.delete);

        return router;
    }

}