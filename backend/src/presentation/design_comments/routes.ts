import { Router } from 'express';
import { DesignCommentController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class DesignCommentRoutes {

    static get routes(): Router {

        const router = Router();

        const controller = new DesignCommentController();

        router.get('/design/:id_design/comments', [AuthMiddleware.validateJWT], controller.getComments);
        router.post('/design/:id_design/comments', [AuthMiddleware.validateJWT], controller.createComment);
        router.delete('/design/:id_design/comments/:id_comment', [AuthMiddleware.validateJWT], controller.deleteComment);

        return router;
    }

}