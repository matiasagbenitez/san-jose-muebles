import { Router } from 'express';
import { AuthRoutes } from './auth/routes';
import { RoleRoutes } from './roles/routes';
import { RoleUserRoutes } from './roles_users/routes';

export class AppRoutes {

    static get routes(): Router {

        const router = Router();

        // Definir las rutas
        router.use('/api/test', (req, res) => {
            res.send('Hello World');
        });

        router.use('/api/auth', AuthRoutes.routes);
        router.use('/api/roles', RoleRoutes.routes);
        router.use('/api/roles_users', RoleUserRoutes.routes);

        return router;
    }

}