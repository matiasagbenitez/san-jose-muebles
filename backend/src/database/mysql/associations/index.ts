import {
    User, Role, RoleUser,
    Country, Province, Locality,
    Supplier,
    BankAccount,
    Bank,

    Product,
    Brand,
    Category,
    Currency,
    UnitOfMeasure,

    Purchase,
    PurchaseItem,
    ReceptionPartial,
    ReceptionTotal,
    SupplierAccount,
    SupplierAccountTransaction,
    PurchaseTransaction,

    StockLot,
    StockAdjust,
    InventoryBrand,
    InventoryCategory,
    InventoryItem,
    InventoryItemEvolution,
    Client,
    VisitReason,
    VisitRequest,
    VisitEvolution,

    Project,
    ProjectAccount,
    ProjectAccountTransaction,
    VisitRequestAudit,

    Group,
    Member,
    GroupMember,
    PurchaseNullation,
    ProjectSupplierTransaction,
    RelatedPerson,

    Estimate,
    EstimateEvolution,
    EstimateItem,

    Entity,
    EntityAccount,
    EntityAccountTransaction,

    Environment,
    TypeOfEnvironment,
    Design,
    Fabrication,
    Installation,
    DesignComment,
    DesignTask,
    DesignTaskEvolution,
    DesignEvolution,
    ProjectEvolution,
    DesignFile,
} from '../models';

export const initializeAssociations = () => {

    // User - Role
    User.belongsToMany(Role, { through: RoleUser, foreignKey: 'id_user', otherKey: 'id_role', as: 'roles', onDelete: 'RESTRICT' });
    Role.belongsToMany(User, { through: RoleUser, foreignKey: 'id_role', otherKey: 'id_user', as: 'users', onDelete: 'RESTRICT' });

    // Country - Province
    Country.hasMany(Province, { foreignKey: 'id_country', as: 'provinces', onDelete: 'RESTRICT' });
    Province.belongsTo(Country, { foreignKey: 'id_country', as: 'country' });

    // Province - Locality
    Province.hasMany(Locality, { foreignKey: 'id_province', as: 'localities', onDelete: 'RESTRICT' });
    Locality.belongsTo(Province, { foreignKey: 'id_province', as: 'province' });

    // Locality - Supplier
    Locality.hasMany(Supplier, { foreignKey: 'id_locality', as: 'suppliers', onDelete: 'RESTRICT' });
    Supplier.belongsTo(Locality, { foreignKey: 'id_locality', as: 'locality' });

    // Supplier - BankAccount
    Bank.hasMany(BankAccount, { foreignKey: 'id_bank', as: 'bank_accounts', onDelete: 'RESTRICT' });
    BankAccount.belongsTo(Bank, { foreignKey: 'id_bank', as: 'bank' });
    Supplier.hasMany(BankAccount, { foreignKey: 'id_supplier', as: 'bank_accounts', onDelete: 'RESTRICT' });
    BankAccount.belongsTo(Supplier, { foreignKey: 'id_supplier', as: 'supplier' });

    // PRODUCT
    Brand.hasMany(Product, { foreignKey: 'id_brand', as: 'products', onDelete: 'RESTRICT' });
    Product.belongsTo(Brand, { foreignKey: 'id_brand', as: 'brand' });

    Category.hasMany(Product, { foreignKey: 'id_category', as: 'products', onDelete: 'RESTRICT' });
    Product.belongsTo(Category, { foreignKey: 'id_category', as: 'category' });

    Currency.hasMany(Product, { foreignKey: 'id_currency', as: 'products', onDelete: 'RESTRICT' });
    Product.belongsTo(Currency, { foreignKey: 'id_currency', as: 'currency' });

    UnitOfMeasure.hasMany(Product, { foreignKey: 'id_unit', as: 'products', onDelete: 'RESTRICT' });
    Product.belongsTo(UnitOfMeasure, { foreignKey: 'id_unit', as: 'unit' });


    // PURCHASE
    Supplier.hasMany(Purchase, { foreignKey: 'id_supplier', as: 'purchases', onDelete: 'RESTRICT' });
    Purchase.belongsTo(Supplier, { foreignKey: 'id_supplier', as: 'supplier' });

    Currency.hasMany(Purchase, { foreignKey: 'id_currency', as: 'purchases', onDelete: 'RESTRICT' });
    Purchase.belongsTo(Currency, { foreignKey: 'id_currency', as: 'currency' });

    // PURCHASE *-* PURCHASE ITEM *-* PRODUCT
    Purchase.hasMany(PurchaseItem, { foreignKey: 'id_purchase', as: 'items', onDelete: 'RESTRICT' });
    PurchaseItem.belongsTo(Purchase, { foreignKey: 'id_purchase', as: 'purchase' });
    Product.hasMany(PurchaseItem, { foreignKey: 'id_product', as: 'purchases', onDelete: 'RESTRICT' });
    PurchaseItem.belongsTo(Product, { foreignKey: 'id_product', as: 'product' });

    Purchase.belongsTo(User, { foreignKey: 'id_user', as: 'user' });

    Purchase.hasOne(PurchaseNullation, { foreignKey: 'id_purchase', as: 'nullation', onDelete: 'RESTRICT' });
    PurchaseNullation.belongsTo(Purchase, { foreignKey: 'id_purchase', as: 'purchase' });

    PurchaseNullation.belongsTo(User, { foreignKey: 'id_user', as: 'user' });

    PurchaseItem.hasMany(ReceptionPartial, { foreignKey: 'id_purchase_item', as: 'receptions', onDelete: 'RESTRICT' });
    ReceptionPartial.belongsTo(User, { foreignKey: 'id_user', as: 'user' });
    ReceptionPartial.belongsTo(PurchaseItem, { foreignKey: 'id_purchase_item', as: 'item' });

    Purchase.hasOne(ReceptionTotal, { foreignKey: 'id_purchase', as: 'reception', onDelete: 'RESTRICT' });
    ReceptionTotal.belongsTo(User, { foreignKey: 'id_user', as: 'user' });
    ReceptionTotal.belongsTo(Purchase, { foreignKey: 'id_purchase', as: 'purchase' });


    // SUPPLIER ACCOUNT TRANSACTIONS
    Supplier.hasMany(SupplierAccount, { foreignKey: 'id_supplier', as: 'accounts', onDelete: 'RESTRICT' });
    SupplierAccount.belongsTo(Supplier, { foreignKey: 'id_supplier', as: 'supplier' });
    SupplierAccount.belongsTo(Currency, { foreignKey: 'id_currency', as: 'currency' });

    SupplierAccount.hasMany(SupplierAccountTransaction, { foreignKey: 'id_supplier_account', as: 'transactions', onDelete: 'RESTRICT' });
    SupplierAccountTransaction.belongsTo(SupplierAccount, { foreignKey: 'id_supplier_account', as: 'account' });
    SupplierAccountTransaction.belongsTo(User, { foreignKey: 'id_user', as: 'user' });

    SupplierAccountTransaction.hasOne(PurchaseTransaction, { foreignKey: 'id_supplier_account_transaction', as: 'purchase_transaction', onDelete: 'RESTRICT' });
    PurchaseTransaction.belongsTo(SupplierAccountTransaction, { foreignKey: 'id_supplier_account_transaction', as: 'supplier_account_transaction' });
    PurchaseTransaction.belongsTo(Purchase, { foreignKey: 'id_purchase', as: 'purchase' });


    // STOCK ADJUST
    StockLot.hasMany(StockAdjust, { foreignKey: 'id_stock_lot', as: 'adjustments', onDelete: 'RESTRICT' });
    StockAdjust.belongsTo(StockLot, { foreignKey: 'id_stock_lot', as: 'lot' });
    StockAdjust.belongsTo(Product, { foreignKey: 'id_product', as: 'product' });
    Product.hasMany(StockAdjust, { foreignKey: 'id_product', as: 'adjustments', onDelete: 'RESTRICT' });
    StockLot.belongsTo(User, { foreignKey: 'id_user', as: 'user' });


    // INVENTORY
    InventoryBrand.hasMany(InventoryItem, { foreignKey: 'id_inventory_brand', as: 'items', onDelete: 'RESTRICT' });
    InventoryItem.belongsTo(InventoryBrand, { foreignKey: 'id_inventory_brand', as: 'brand' });

    InventoryCategory.hasMany(InventoryItem, { foreignKey: 'id_inventory_categ', as: 'items', onDelete: 'RESTRICT' });
    InventoryItem.belongsTo(InventoryCategory, { foreignKey: 'id_inventory_categ', as: 'category' });

    InventoryItem.belongsTo(User, { foreignKey: 'last_check_by', as: 'user_check' });

    InventoryItem.hasMany(InventoryItemEvolution, { foreignKey: 'id_inventory_item', as: 'evolutions', onDelete: 'RESTRICT' });
    InventoryItemEvolution.belongsTo(InventoryItem, { foreignKey: 'id_inventory_item', as: 'item' });
    InventoryItemEvolution.belongsTo(User, { foreignKey: 'id_user', as: 'user' });

    // CLIENT
    Locality.hasMany(Client, { foreignKey: 'id_locality', as: 'clients', onDelete: 'RESTRICT' });
    Client.belongsTo(Locality, { foreignKey: 'id_locality', as: 'locality' });

    // VISIT REQUEST
    Client.hasMany(VisitRequest, { foreignKey: 'id_client', as: 'visit_requests', onDelete: 'RESTRICT' });
    VisitRequest.belongsTo(Client, { foreignKey: 'id_client', as: 'client' });

    Locality.hasMany(VisitRequest, { foreignKey: 'id_locality', as: 'visit_requests', onDelete: 'RESTRICT' });
    VisitRequest.belongsTo(Locality, { foreignKey: 'id_locality', as: 'locality' });

    VisitRequest.belongsTo(User, { foreignKey: 'id_user', as: 'user' });

    VisitReason.hasMany(VisitRequest, { foreignKey: 'id_visit_reason', as: 'visit_requests', onDelete: 'RESTRICT' });
    VisitRequest.belongsTo(VisitReason, { foreignKey: 'id_visit_reason', as: 'reason' });

    // VISIT EVOLUTION
    VisitRequest.hasMany(VisitEvolution, { foreignKey: 'id_visit_request', as: 'evolutions', onDelete: 'RESTRICT' });
    VisitEvolution.belongsTo(VisitRequest, { foreignKey: 'id_visit_request', as: 'visit' });

    VisitEvolution.belongsTo(User, { foreignKey: 'id_user', as: 'user' });

    // VISIT REQUEST AUDIT
    VisitRequest.hasMany(VisitRequestAudit, { foreignKey: 'id_row', as: 'audits', onDelete: 'RESTRICT' });
    VisitRequestAudit.belongsTo(VisitRequest, { foreignKey: 'id_row', as: 'visit' });

    VisitRequestAudit.belongsTo(User, { foreignKey: 'id_user', as: 'user' });


    // PROJECT
    Locality.hasMany(Project, { foreignKey: 'id_locality', as: 'projects', onDelete: 'RESTRICT' });
    Project.belongsTo(Locality, { foreignKey: 'id_locality', as: 'locality' });

    Client.hasMany(Project, { foreignKey: 'id_client', as: 'projects', onDelete: 'RESTRICT' });
    Project.belongsTo(Client, { foreignKey: 'id_client', as: 'client' });

    Project.hasMany(ProjectAccount, { foreignKey: 'id_project', as: 'accounts', onDelete: 'RESTRICT' });
    ProjectAccount.belongsTo(Project, { foreignKey: 'id_project', as: 'project' });

    Currency.hasMany(ProjectAccount, { foreignKey: 'id_currency', as: 'accounts', onDelete: 'RESTRICT' });
    ProjectAccount.belongsTo(Currency, { foreignKey: 'id_currency', as: 'currency' });

    Project.hasMany(ProjectEvolution, { foreignKey: 'id_project', as: 'evolutions', onDelete: 'RESTRICT' });
    ProjectEvolution.belongsTo(Project, { foreignKey: 'id_project', as: 'project' });

    ProjectEvolution.belongsTo(User, { foreignKey: 'id_user', as: 'user' });


    ProjectAccount.hasMany(ProjectAccountTransaction, { foreignKey: 'id_project_account', as: 'transactions', onDelete: 'RESTRICT' });
    ProjectAccountTransaction.belongsTo(ProjectAccount, { foreignKey: 'id_project_account', as: 'account' });

    ProjectAccountTransaction.belongsTo(User, { foreignKey: 'id_user', as: 'user' });

    ProjectAccountTransaction.belongsTo(Currency, { foreignKey: 'id_currency', as: 'currency' });

    ProjectAccountTransaction.hasOne(ProjectSupplierTransaction, { foreignKey: 'id_project_account_transaction', as: 'project_supplier_transaction', onDelete: 'RESTRICT' });
    ProjectSupplierTransaction.belongsTo(ProjectAccountTransaction, { foreignKey: 'id_project_account_transaction', as: 'project_transaction', onDelete: 'RESTRICT' });

    SupplierAccountTransaction.hasOne(ProjectSupplierTransaction, { foreignKey: 'id_supplier_account_transaction', as: 'project_supplier_transaction', onDelete: 'RESTRICT' });
    ProjectSupplierTransaction.belongsTo(SupplierAccountTransaction, { foreignKey: 'id_supplier_account_transaction', as: 'supplier_transaction', onDelete: 'RESTRICT' });


    // RelatedPerson with Project
    Project.hasMany(RelatedPerson, { foreignKey: 'id_project', as: 'related_persons', onDelete: 'RESTRICT' });
    RelatedPerson.belongsTo(Project, { foreignKey: 'id_project', as: 'project' });

    // GROUP

    // many to many
    Member.belongsToMany(Group, { through: GroupMember, foreignKey: 'id_member', otherKey: 'id_group', as: 'groups', onDelete: 'RESTRICT' });
    Group.belongsToMany(Member, { through: GroupMember, foreignKey: 'id_group', otherKey: 'id_member', as: 'members', onDelete: 'RESTRICT' });


    // ESTIMATIONS
    Project.hasMany(Estimate, { foreignKey: 'id_project', as: 'estimates', onDelete: 'RESTRICT' });
    Estimate.belongsTo(Project, { foreignKey: 'id_project', as: 'project' });

    Currency.hasMany(Estimate, { foreignKey: 'id_currency', as: 'estimates', onDelete: 'RESTRICT' });
    Estimate.belongsTo(Currency, { foreignKey: 'id_currency', as: 'currency' });

    Estimate.hasMany(EstimateItem, { foreignKey: 'id_estimate', as: 'items', onDelete: 'CASCADE' });
    EstimateItem.belongsTo(Estimate, { foreignKey: 'id_estimate', as: 'estimate' });

    Estimate.belongsTo(User, { foreignKey: 'id_user', as: 'user' });

    Estimate.hasMany(EstimateEvolution, { foreignKey: 'id_estimate', as: 'evolutions', onDelete: 'CASCADE' });
    EstimateEvolution.belongsTo(Estimate, { foreignKey: 'id_estimate', as: 'estimate' });

    EstimateEvolution.belongsTo(User, { foreignKey: 'id_user', as: 'user' });

    Locality.hasMany(Entity, { foreignKey: 'id_locality', as: 'entities', onDelete: 'RESTRICT' });
    Entity.belongsTo(Locality, { foreignKey: 'id_locality', as: 'locality' });

    Entity.hasMany(EntityAccount, { foreignKey: 'id_entity', as: 'accounts', onDelete: 'RESTRICT' });
    EntityAccount.belongsTo(Entity, { foreignKey: 'id_entity', as: 'entity' });
    EntityAccount.belongsTo(Currency, { foreignKey: 'id_currency', as: 'currency' });

    EntityAccount.hasMany(EntityAccountTransaction, { foreignKey: 'id_entity_account', as: 'transactions', onDelete: 'RESTRICT' });
    EntityAccountTransaction.belongsTo(EntityAccount, { foreignKey: 'id_entity_account', as: 'account' });
    EntityAccountTransaction.belongsTo(User, { foreignKey: 'id_user', as: 'user' });


    // ENVIRONMENT
    Project.hasMany(Environment, { foreignKey: 'id_project', as: 'environments', onDelete: 'RESTRICT' });
    Environment.belongsTo(Project, { foreignKey: 'id_project', as: 'project' });

    TypeOfEnvironment.hasMany(Environment, { foreignKey: 'id_type_of_environment', as: 'environments', onDelete: 'RESTRICT' });
    Environment.belongsTo(TypeOfEnvironment, { foreignKey: 'id_type_of_environment', as: 'type' });

    Environment.hasOne(Design, { foreignKey: 'id_environment', as: 'design', onDelete: 'RESTRICT' });
    Design.belongsTo(Environment, { foreignKey: 'id_environment', as: 'environment' });
    Environment.hasOne(Fabrication, { foreignKey: 'id_environment', as: 'fabrication', onDelete: 'RESTRICT' });
    Fabrication.belongsTo(Environment, { foreignKey: 'id_environment', as: 'environment' });
    Environment.hasOne(Installation, { foreignKey: 'id_environment', as: 'installation', onDelete: 'RESTRICT' });
    Installation.belongsTo(Environment, { foreignKey: 'id_environment', as: 'environment' });

    // DESIGN
    Design.hasMany(DesignComment, { foreignKey: 'id_design', as: 'comments', onDelete: 'RESTRICT' });
    DesignComment.belongsTo(Design, { foreignKey: 'id_design', as: 'design' });
    DesignComment.belongsTo(User, { foreignKey: 'id_user', as: 'user' });

    Design.hasMany(DesignTask, { foreignKey: 'id_design', as: 'tasks', onDelete: 'RESTRICT' });
    DesignTask.belongsTo(Design, { foreignKey: 'id_design', as: 'design' });
    DesignTask.belongsTo(User, { foreignKey: 'id_user', as: 'user' });

    DesignTask.hasMany(DesignTaskEvolution, { foreignKey: 'id_design_task', as: 'evolutions', onDelete: 'RESTRICT' });
    DesignTaskEvolution.belongsTo(DesignTask, { foreignKey: 'id_design_task', as: 'task' });
    DesignTaskEvolution.belongsTo(User, { foreignKey: 'id_user', as: 'user' });

    Design.hasMany(DesignEvolution, { foreignKey: 'id_design', as: 'evolutions', onDelete: 'RESTRICT' });
    DesignEvolution.belongsTo(User, { foreignKey: 'id_user', as: 'user' });

    Design.hasMany(DesignFile, { foreignKey: 'id_design', as: 'files', onDelete: 'RESTRICT' });
    DesignFile.belongsTo(Design, { foreignKey: 'id_design', as: 'design' });

    DesignFile.belongsTo(User, { foreignKey: 'id_user', as: 'user' });

};