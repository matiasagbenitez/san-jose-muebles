import { Router } from 'express';
import { EnvironmentController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class EnvironmentRoutes {

    static get routes(): Router {

        const router = Router();

        const controller = new EnvironmentController();

        router.get('/by-project/:id_project/paginated', [AuthMiddleware.validateJWT], controller.getByProjectPaginated);
        router.get('/paginated', [AuthMiddleware.validateJWT], controller.getAllPaginated);
        
        router.get('/:id', [AuthMiddleware.validateJWT], controller.getById);
        router.post('/', [AuthMiddleware.validateJWT], controller.create);
        router.put('/:id', [AuthMiddleware.validateJWT], controller.update);
        router.delete('/:id', [AuthMiddleware.validateJWT], controller.delete);

        return router;
    }

}