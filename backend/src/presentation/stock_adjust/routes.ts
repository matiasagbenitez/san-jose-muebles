import { Router } from 'express';
import { StockAdjustController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class StockAdjustRoutes {

    static get routes(): Router {

        const router = Router();

        const controller = new StockAdjustController();

        router.get('/by-product/:id_product/paginated', [AuthMiddleware.validateJWT], controller.getAllByIdProduct);

        return router;
    }

}