import { Router } from 'express';
import { StockLotController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class StockLotRoutes {

    static get routes(): Router {

        const router = Router();

        const controller = new StockLotController();

        router.post('/create', [AuthMiddleware.validateJWT], controller.create);

        return router;
    }

}