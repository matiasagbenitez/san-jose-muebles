import { Router } from 'express';
import { VisitRequestController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class VisitRequestRoutes {

    static get routes(): Router {

        const router = Router();

        const controller = new VisitRequestController();

        router.get('/', [AuthMiddleware.validateJWT], controller.getAll);
        router.get('/paginated', [AuthMiddleware.validateJWT], controller.getAllPaginated);
        router.get('/:id', [AuthMiddleware.validateJWT], controller.getById);
        router.get('/:id/editable', [AuthMiddleware.validateJWT], controller.getByIdEditable);
        router.post('/', [AuthMiddleware.validateJWT], controller.create);
        router.put('/:id', [AuthMiddleware.validateJWT], controller.update);
        router.delete('/:id', [AuthMiddleware.validateJWT], controller.delete);

        return router;
    }

}