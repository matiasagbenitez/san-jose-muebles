import { Router } from 'express';
import { ProjectAccountController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class ProjectAccountRoutes {

    static get routes(): Router {

        const router = Router();

        const controller = new ProjectAccountController();

        router.get('/paginated', [AuthMiddleware.validateJWT], controller.getAllPaginated);
        
        router.get('/project/:id_project/account/:id_project_account', [AuthMiddleware.validateJWT], controller.getDataById);

        router.get('/project/:id_project', [AuthMiddleware.validateJWT], controller.getByProject);

        router.post('/', [AuthMiddleware.validateJWT], controller.create);

        return router;
    }

}