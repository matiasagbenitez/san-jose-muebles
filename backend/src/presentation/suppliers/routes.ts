import { Router } from 'express';
import { SupplierController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class SupplierRoutes {

    static get routes(): Router {

        const router = Router();

        const controller = new SupplierController();

        router.get('/', [AuthMiddleware.validateJWT], controller.getAll);
        router.get('/select', [AuthMiddleware.validateJWT], controller.getAllSelect);
        router.get('/paginated', [AuthMiddleware.validateJWT], controller.getAllPaginated);
        router.get('/:id', [AuthMiddleware.validateJWT], controller.getById);
        router.post('/', [AuthMiddleware.validateJWT], controller.create);
        router.put('/:id', [AuthMiddleware.validateJWT], controller.update);
        router.delete('/:id', [AuthMiddleware.validateJWT], controller.delete);

        return router;
    }

}