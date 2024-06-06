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
import { VisitReasonRoutes } from './visit_reasons/routes';
import { TypeOfProjectRoutes } from './types_of_projects/routes';
import { BankRoutes } from './banks/routes';
import { SupplierRoutes } from './suppliers/routes';
import { BankAccountRoutes } from './bank_accounts/routes';
import { ProductRoutes } from './products/routes';
import { PurchaseRoutes } from './purchases/routes';
import { SupplierAccountRoutes } from './supplier_accounts/routes';
import { SupplierAccountTransactionRoutes } from './supplier_account_transactions/routes';

import { StockLotRoutes } from './stock_lot/routes';
import { StockAdjustRoutes } from './stock_adjust/routes';

import { InventoryBrandRoutes } from './inventory_brands/routes';
import { InventoryCategoryRoutes } from './inventory_categories/routes';
import { InventoryItemRoutes } from './inventory_items/routes';
import { ClientRoutes } from './clients/routes';
import { VisitRequestRoutes } from './visit_requests/routes';
import { ProjectRoutes } from './projects/routes';
import { ProjectAccountRoutes } from './project_accounts/routes';
import { ProjectAccountTransactionRoutes } from './project_account_transactions/routes';

import { MemberRoutes } from './members/routes';
import { RelatedPersonRoutes } from './related_persons/routes';

import { EstimateRoutes } from './estimates/routes';
import { EntityRoutes } from './entities/routes';
import { EntityAccountRoutes } from './entity_accounts/routes';
import { EntityAccountTransactionRoutes } from './entity_account_transactions/routes';

// AMBIENTES
import { EnvironmentRoutes } from './environments/routes';
import { DesignRoutes } from './designs/routes';
import { DesignCommentRoutes } from './design_comments/routes';
import { DesignTaskRoutes } from './design_tasks/routes';

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
        router.use('/api/visit_reasons', VisitReasonRoutes.routes);
        router.use('/api/types_of_projects', TypeOfProjectRoutes.routes);
        router.use('/api/banks', BankRoutes.routes);
        router.use('/api/suppliers', SupplierRoutes.routes);
        router.use('/api/bank_accounts', BankAccountRoutes.routes);

        router.use('/api/products', ProductRoutes.routes);
        router.use('/api/purchases', PurchaseRoutes.routes);

        router.use('/api/supplier_accounts', SupplierAccountRoutes.routes);
        router.use('/api/supplier_account_transactions', SupplierAccountTransactionRoutes.routes);

        router.use('/api/stock_lots', StockLotRoutes.routes);
        router.use('/api/stock_adjusts', StockAdjustRoutes.routes);

        router.use('/api/inventory_brands', InventoryBrandRoutes.routes);
        router.use('/api/inventory_categories', InventoryCategoryRoutes.routes);
        router.use('/api/inventory_items', InventoryItemRoutes.routes);

        router.use('/api/clients', ClientRoutes.routes);
        router.use('/api/visit_requests', VisitRequestRoutes.routes);

        router.use('/api/projects', ProjectRoutes.routes);
        router.use('/api/project_accounts', ProjectAccountRoutes.routes);
        router.use('/api/project_account_transactions', ProjectAccountTransactionRoutes.routes);

        router.use('/api/members', MemberRoutes.routes);
        router.use('/api/related_persons', RelatedPersonRoutes.routes);

        router.use('/api/estimates', EstimateRoutes.routes);


        router.use('/api/entities', EntityRoutes.routes);
        router.use('/api/entity_accounts', EntityAccountRoutes.routes);
        router.use('/api/entity_account_transactions', EntityAccountTransactionRoutes.routes);

        // AMBIENTES
        router.use('/api/environments', EnvironmentRoutes.routes);

        // DISEÑOS
        router.use('/api/designs', DesignRoutes.routes);
        router.use('/api/design_comments', DesignCommentRoutes.routes);
        router.use('/api/design_tasks', DesignTaskRoutes.routes);


        return router;
    }

}