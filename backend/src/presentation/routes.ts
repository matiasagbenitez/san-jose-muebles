import { Router } from 'express';
import { AuthRoutes } from './auth/routes';
import { RoleRoutes } from './roles/routes';
import { RoleUserRoutes } from './roles_users/routes';
import { CountryRoutes } from './countries/routes';
import { ProvinceRoutes } from './provinces/routes';
import { LocalityRoutes } from './localities/routes';
import { CurrencyRoutes } from './currencies/routes';
import { PaymentMethodRoutes } from './payment_methods/routes';
import { TypeOfEnvironmentRoutes } from './types_of_environments/routes';
import { BrandRoutes } from './brands/routes';
import { CategoryRoutes } from './categories/routes';
import { UnitOfMeasureRoutes } from './units_of_measures/routes';
import { PriorityRoutes } from './priorities/routes';
import { TypeOfProjectRoutes } from './types_of_projects/routes';           
import { BankRoutes } from './banks/routes';
import { SupplierRoutes } from './suppliers/routes';
import { BankAccountRoutes } from './bank_accounts/routes';
import { ProductRoutes } from './products/routes';
import { PurchaseRoutes } from './purchases/routes';
import { SupplierAccountRoutes } from './supplier_accounts/routes';
import { SupplierAccountTransactionRoutes } from './supplier_account_transactions/routes';

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
        router.use('/api/countries', CountryRoutes.routes);
        router.use('/api/provinces', ProvinceRoutes.routes);
        router.use('/api/localities', LocalityRoutes.routes);
        router.use('/api/currencies', CurrencyRoutes.routes);
        router.use('/api/payment_methods', PaymentMethodRoutes.routes);
        router.use('/api/types_of_environments', TypeOfEnvironmentRoutes.routes);
        router.use('/api/brands', BrandRoutes.routes);
        router.use('/api/categories', CategoryRoutes.routes);
        router.use('/api/units_of_measures', UnitOfMeasureRoutes.routes);
        router.use('/api/priorities', PriorityRoutes.routes);
        router.use('/api/types_of_projects', TypeOfProjectRoutes.routes);
        router.use('/api/banks', BankRoutes.routes);
        router.use('/api/suppliers', SupplierRoutes.routes);
        router.use('/api/bank_accounts', BankAccountRoutes.routes);

        router.use('/api/products', ProductRoutes.routes);
        router.use('/api/purchases', PurchaseRoutes.routes);

        router.use('/api/supplier_accounts', SupplierAccountRoutes.routes);
        router.use('/api/supplier_account_transactions', SupplierAccountTransactionRoutes.routes);


        return router;
    }

}