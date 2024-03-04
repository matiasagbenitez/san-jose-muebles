import { Router } from 'express';
import { BankAccountController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class BankAccountRoutes {

    static get routes(): Router {

        const router = Router();

        const controller = new BankAccountController();

        router.get('/', [AuthMiddleware.validateJWT], controller.getAll);
        router.get('/supplier/:id_supplier', [AuthMiddleware.validateJWT], controller.getAllBySupplier);
        router.get('/:id', [AuthMiddleware.validateJWT], controller.getById);
        router.post('/', [AuthMiddleware.validateJWT], controller.create);
        router.put('/:id', [AuthMiddleware.validateJWT], controller.update);
        router.delete('/:id', [AuthMiddleware.validateJWT], controller.delete);

        return router;
    }

}