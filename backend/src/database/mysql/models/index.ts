import { Sequelize } from 'sequelize';
import { User, initUserModel } from './User.model';
import { Role, initRoleModel } from './Role.model';
import { RoleUser, initRoleUserModel } from './RoleUser.model';
import { Country, initCountryModel } from './Country.model';
import { Province, initProvinceModel } from './Province.model';
import { Locality, initLocalityModel } from './Locality.model';
import { Currency, initCurrencyModel } from './Currency.model';
import { PaymentMethod, initPaymentMethodModel } from './PaymentMethod.model';
import { TypeOfEnvironment, initTypeOfEnvironmentModel } from './TypeOfEnvironment';
import { Brand, initBrandModel } from './Brand.model';
import { Category, initCategoryModel } from './Category.model';
import { UnitOfMeasure, initUnitOfMeasureModel } from './UnitOfMeasure.model';
import { Priority, initPriorityModel } from './Priority.model';
import { TypeOfProject, initTypeOfProjectModel } from './TypeOfProject';
import { Bank, initBankModel } from './Bank.model';
import { Supplier, initSupplierModel } from './Supplier.model';
import { BankAccount, initBankAccountModel } from './BankAccount.model';
import { Product, initProductModel } from './Product.model';
import { Purchase, initPurchaseModel } from './Purchase.model';
import { PurchaseItem, initPurchaseItemModel } from './PurchaseItem.model';
import { ReceptionPartial, initReceptionPartialModel } from './ReceptionPartial.model';
import { ReceptionTotal, initReceptionTotalModel } from './ReceptionTotal.model';

import { SupplierAccount, initSupplierAccountModel } from './SupplierAccount.model';
import { SupplierAccountTransaction, initSupplierAccountTransactionModel } from './SupplierAccountTransaction.model';
import { PurchaseTransaction, initPurchaseTransactionModel } from './PurchaseTransaction.model';

export const initializeModels = (sequelize: Sequelize) => {
  initUserModel(sequelize);
  initRoleModel(sequelize);
  initRoleUserModel(sequelize);
  initCountryModel(sequelize);
  initProvinceModel(sequelize);
  initLocalityModel(sequelize);
  initCurrencyModel(sequelize);
  initPaymentMethodModel(sequelize);
  initTypeOfEnvironmentModel(sequelize);
  initBrandModel(sequelize);
  initCategoryModel(sequelize);
  initUnitOfMeasureModel(sequelize);
  initPriorityModel(sequelize);
  initTypeOfProjectModel(sequelize);
  initBankModel(sequelize);
  initSupplierModel(sequelize);
  initBankAccountModel(sequelize);

  initProductModel(sequelize);
  initPurchaseModel(sequelize);
  initPurchaseItemModel(sequelize);
  initReceptionPartialModel(sequelize);
  initReceptionTotalModel(sequelize);

  initSupplierAccountModel(sequelize);
  initSupplierAccountTransactionModel(sequelize);
  initPurchaseTransactionModel(sequelize);

};

export {
  User,
  Role,
  RoleUser,
  Country,
  Province,
  Locality,
  Currency,
  PaymentMethod,
  TypeOfEnvironment,
  Brand,
  Category,
  UnitOfMeasure,
  Priority,
  TypeOfProject,
  Bank,
  Supplier,
  BankAccount,
  Product,
  Purchase,
  PurchaseItem,
  ReceptionPartial,
  ReceptionTotal,

  SupplierAccount,
  SupplierAccountTransaction,
  PurchaseTransaction,
};