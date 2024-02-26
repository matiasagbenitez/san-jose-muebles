import { Router } from 'express';
import { CountryController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class CountryRoutes {

    static get routes(): Router {

        const router = Router();

        const controller = new CountryController();

        router.get('/', [AuthMiddleware.validateJWT], controller.getAll);
        router.get('/:id', [AuthMiddleware.validateJWT], controller.getById);
        router.post('/', [AuthMiddleware.validateJWT], controller.create);
        router.put('/:id', [AuthMiddleware.validateJWT], controller.update);
        router.delete('/:id', [AuthMiddleware.validateJWT], controller.delete);

        return router;
    }

}