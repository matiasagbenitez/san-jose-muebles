import { Router } from 'express';
import { DesignFileController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import MulterConfig from '../../config/multer.config';

export class DesignFileRoutes {

    static get routes(): Router {

        const router = Router();

        const controller = new DesignFileController();
        const uploadMemory = MulterConfig.getMemoryUpload('file', 'files', 10);

        router.get('/:id', controller.getDesignFiles);
        router.post('/:id', [AuthMiddleware.validateJWT, uploadMemory.multiple], controller.uploadDesignFiles);
        router.delete('/:id', AuthMiddleware.validateJWT, controller.deleteDesignFile);


        return router;
    }

}