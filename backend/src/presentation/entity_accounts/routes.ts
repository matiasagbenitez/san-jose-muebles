import { Router } from 'express';
import { EntityAccountController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class EntityAccountRoutes {

    static get routes(): Router {

        const router = Router();

        const controller = new EntityAccountController();

        router.get('/paginated', [AuthMiddleware.validateJWT], controller.getAllPaginated);

        router.get('/entity/:id_entity/account/:id_entity_account', [AuthMiddleware.validateJWT], controller.getDataById);

        router.get('/entity/:id_entity', [AuthMiddleware.validateJWT], controller.getByEntity);

        router.post('/', [AuthMiddleware.validateJWT], controller.create);

        return router;
    }

}