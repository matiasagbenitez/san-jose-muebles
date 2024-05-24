import { Router } from 'express';
import { ProductController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class ProductRoutes {

    static get routes(): Router {

        const router = Router();

        const controller = new ProductController();

        router.get('/select2', [AuthMiddleware.validateJWT], controller.getSelect2);
        router.get('/', [AuthMiddleware.validateJWT], controller.getAll);
        router.get('/paginated', [AuthMiddleware.validateJWT], controller.getAllPaginated);
        router.get('/:id', [AuthMiddleware.validateJWT], controller.getById);
        router.get('/:id/editable', [AuthMiddleware.validateJWT], controller.getByIdEditable);
        router.put('/:id/adjust-stock', [AuthMiddleware.validateJWT], controller.adjustProductStock);
        router.post('/', [AuthMiddleware.validateJWT], controller.create);
        router.put('/:id', [AuthMiddleware.validateJWT], controller.update);
        router.delete('/:id', [AuthMiddleware.validateJWT], controller.delete);

        return router;
    }

}