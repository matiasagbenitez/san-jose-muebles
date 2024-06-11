import { Router } from 'express';
import { AuthController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class AuthRoutes {

    static get routes(): Router {

        const router = Router();

        const controller = new AuthController();

        router.post('/login', controller.login);
        router.post('/register', controller.register);
        router.get('/renew', [AuthMiddleware.validateJWT], controller.revalidateToken);

        router.get('/:id/profile', [AuthMiddleware.validateJWT], controller.getUserProfile);
        router.put('/:id/profile', [AuthMiddleware.validateJWT], controller.updateProfile);
        router.patch('/:id/password', [AuthMiddleware.validateJWT], controller.updatePassword);

        return router;
    }

}