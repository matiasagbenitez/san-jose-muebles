import { Router } from 'express';
import { DesignTaskController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class DesignTaskRoutes {

    static get routes(): Router {

        const router = Router();

        const controller = new DesignTaskController();

        router.post('/design/:id_design', [AuthMiddleware.validateJWT], controller.createTask);
        router.patch('/task/:id_task/status', [AuthMiddleware.validateJWT], controller.updateStatus);
        router.delete('/design/:id_design/task/:id_task', [AuthMiddleware.validateJWT], controller.deleteTask);

        return router;
    }

}