import { Router } from 'express';
import { EnvironmentController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class EnvironmentRoutes {

    static get routes(): Router {

        const router = Router();

        const controller = new EnvironmentController();

        router.get('/by-project/:id_project', [AuthMiddleware.validateJWT], controller.getByProject);
        router.get('/paginated', [AuthMiddleware.validateJWT], controller.getAllPaginated);
        
        router.get('/project/:id_project/environment/:id_environment', [AuthMiddleware.validateJWT], controller.getById);
        router.post('/', [AuthMiddleware.validateJWT], controller.create);
        router.put('/:id', [AuthMiddleware.validateJWT], controller.update);
        router.delete('/:id', [AuthMiddleware.validateJWT], controller.delete);

        return router;
    }

}