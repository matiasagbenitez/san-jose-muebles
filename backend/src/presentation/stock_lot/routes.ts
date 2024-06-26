import { Router } from 'express';
import { StockLotController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class StockLotRoutes {

    static get routes(): Router {

        const router = Router();

        const controller = new StockLotController();

        router.get('/paginated', [AuthMiddleware.validateJWT], controller.getLotsPaginated);
        router.get('/:id/basic', [AuthMiddleware.validateJWT], controller.getLotBasic);
        router.get('/:id/paginated', [AuthMiddleware.validateJWT], controller.getLotPaginated);
        router.post('/create', [AuthMiddleware.validateJWT], controller.create);

        return router;
    }

}