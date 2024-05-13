import { Router } from 'express';
import { RelatedPersonController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class RelatedPersonRoutes {

    static get routes(): Router {

        const router = Router();

        const controller = new RelatedPersonController();

        router.get('/', [AuthMiddleware.validateJWT], controller.getAll);
        router.get('/project/:id_project', [AuthMiddleware.validateJWT], controller.getAllByProject);
        router.post('/', [AuthMiddleware.validateJWT], controller.create);
        router.put('/:id', [AuthMiddleware.validateJWT], controller.update);
        router.delete('/:id', [AuthMiddleware.validateJWT], controller.delete);

        return router;
    }

}