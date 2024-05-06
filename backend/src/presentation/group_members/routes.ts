import { Router } from 'express';
import { GroupMemberController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class GroupMemberRoutes {

    static get routes(): Router {

        const router = Router();

        const controller = new GroupMemberController();

        router.post('/', [AuthMiddleware.validateJWT], controller.add);
        router.delete('/', [AuthMiddleware.validateJWT], controller.remove);

        return router;
    }

}