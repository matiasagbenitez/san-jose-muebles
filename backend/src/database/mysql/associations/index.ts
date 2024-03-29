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

    Purchase.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
    Purchase.belongsTo(User, { foreignKey: 'nullified_by', as: 'nullifier' });

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
};