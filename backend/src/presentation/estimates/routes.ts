import { Router } from 'express';
import { EstimateController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class EstimateRoutes {

    static get routes(): Router {

        const router = Router();

        const controller = new EstimateController();

        router.get('/', [AuthMiddleware.validateJWT], controller.getAll);
        router.get('/paginated', [AuthMiddleware.validateJWT], controller.getAllPaginated);
        router.get('/:id', [AuthMiddleware.validateJWT], controller.getById);
        router.get('/by-project/:id', [AuthMiddleware.validateJWT], controller.getByProject);
        router.post('/', [AuthMiddleware.validateJWT], controller.create);
        router.delete('/:id', [AuthMiddleware.validateJWT], controller.delete);

        return router;
    }

}