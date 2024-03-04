import { 
    User, Role, RoleUser,
    Country, Province, Locality,
    Supplier,
    BankAccount,
    Bank,
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


};