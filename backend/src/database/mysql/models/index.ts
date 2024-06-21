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
import { VisitReason, initVisitReasonModel } from './VisitReason.model';
import { TypeOfProject, initTypeOfProjectModel } from './TypeOfProject';
import { Bank, initBankModel } from './Bank.model';
import { Supplier, initSupplierModel } from './Supplier.model';
import { BankAccount, initBankAccountModel } from './BankAccount.model';
import { Product, initProductModel } from './Product.model';
import { Purchase, initPurchaseModel } from './Purchase.model';
import { PurchaseItem, initPurchaseItemModel } from './PurchaseItem.model';
import { PurchaseNullation, initPurchaseNullationModel } from './PurchaseNullation.model';
import { ReceptionPartial, initReceptionPartialModel } from './ReceptionPartial.model';
import { ReceptionTotal, initReceptionTotalModel } from './ReceptionTotal.model';

import { SupplierAccount, initSupplierAccountModel } from './SupplierAccount.model';
import { SupplierAccountTransaction, initSupplierAccountTransactionModel } from './SupplierAccountTransaction.model';
import { PurchaseTransaction, initPurchaseTransactionModel } from './PurchaseTransaction.model';

import { StockLot, initStockLotModel } from './StockLot.model';
import { StockAdjust, initStockAdjustModel } from './StockAdjust.model';
import { InventoryBrand, initInventoryBrandModel } from './InventoryBrand.model';
import { InventoryCategory, initInventoryCategoryModel } from './InventoryCategory.model';
import { InventoryItem, initInventoryItemModel } from './InventoryItem.model';
import { InventoryItemEvolution, initInventoryItemEvolutionModel } from './InventoryItemEvolution.model';
import { Client, initClientModel } from './Client.model';
import { VisitRequest, initVisitRequestModel } from './VisitRequest.model';
import { VisitEvolution, initVisitEvolutionModel } from './VisitEvolution.model';

import { Project, initProjectModel } from './Project.model';
import { ProjectEvolution, initProjectEvolutionModel } from './ProjectEvolution.model';
import { ProjectAccount, initProjectAccountModel } from './ProjectAccount.model';
import { ProjectAccountTransaction, initProjectAccountTransactionModel } from './ProjectAccountTransaction.model';
import { ProjectSupplierTransaction, initProjectSupplierTransactionModel } from './ProjectSupplierTransaction';

import { VisitRequestAudit, initVisitRequestAuditModel } from './VisitRequestAudit.model';

import { Group, initGroupModel } from './Group.model';
import { Member, initMemberModel } from './Member.model';
import { GroupMember, initGroupMemberModel } from './GroupMember.model';

import { RelatedPerson, initRelatedPersonModel } from './RelatedPerson.model';

import { Estimate, initEstimateModel } from './Estimate.model';
import { EstimateEvolution, initEstimateEvolutionModel } from './EstimateEvolution.model';
import { EstimateItem, initEstimateItemModel } from './EstimateItem.model';

import { Entity, initEntityModel } from './Entity.model';
import { EntityAccount, initEntityAccountModel } from './EntityAccount.model';
import { EntityAccountTransaction, initEntityAccountTransactionModel } from './EntityAccountTransaction.model';

// ENVIRONMENTS
import { Environment, initEnvironmentModel } from './Environment.model';
import { Design, initDesignModel } from './Design.model';
import { Fabrication, initFabricationModel } from './Fabrication.model';
import { Installation, initInstallationModel } from './Installation.model';

// DESIGN
import { DesignComment, initDesignCommentModel } from './DesignComment.model';
import { DesignTask, initDesignTaskModel } from './DesignTask.model';
import { DesignTaskEvolution, initDesignTaskEvolutionModel } from './DesignTaskEvolution.model ';
import { DesignEvolution, initDesignEvolutionModel } from './DesignEvolution.model';
import { DesignFile, initDesignFileModel } from './DesignFile.model';


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
  initVisitReasonModel(sequelize);
  initTypeOfProjectModel(sequelize);
  initBankModel(sequelize);
  initSupplierModel(sequelize);
  initBankAccountModel(sequelize);

  initProductModel(sequelize);
  initPurchaseModel(sequelize);
  initPurchaseItemModel(sequelize);
  initPurchaseNullationModel(sequelize);
  initReceptionPartialModel(sequelize);
  initReceptionTotalModel(sequelize);

  initSupplierAccountModel(sequelize);
  initSupplierAccountTransactionModel(sequelize);
  initPurchaseTransactionModel(sequelize);

  initStockLotModel(sequelize);
  initStockAdjustModel(sequelize);
  initInventoryBrandModel(sequelize);
  initInventoryCategoryModel(sequelize);
  initInventoryItemModel(sequelize);
  initInventoryItemEvolutionModel(sequelize);

  initClientModel(sequelize);
  initVisitRequestModel(sequelize);
  initVisitEvolutionModel(sequelize);
  initVisitRequestAuditModel(sequelize);

  // PROJECT
  initProjectModel(sequelize);
  initProjectEvolutionModel(sequelize);
  initProjectAccountModel(sequelize);
  initProjectAccountTransactionModel(sequelize);
  initProjectSupplierTransactionModel(sequelize);
  initRelatedPersonModel(sequelize);

  // GROUP
  initMemberModel(sequelize);
  initGroupModel(sequelize);
  initGroupMemberModel(sequelize);

  // PROYECTO
  initEstimateModel(sequelize);
  initEstimateEvolutionModel(sequelize);
  initEstimateItemModel(sequelize);

  // ENTITIES
  initEntityModel(sequelize);
  initEntityAccountModel(sequelize);
  initEntityAccountTransactionModel(sequelize);

  // ENVIRONMENTS
  initEnvironmentModel(sequelize);
  initDesignModel(sequelize);
  initFabricationModel(sequelize);
  initInstallationModel(sequelize);

  // DESIGN
  initDesignCommentModel(sequelize);
  initDesignTaskModel(sequelize);
  initDesignTaskEvolutionModel(sequelize);
  initDesignEvolutionModel(sequelize);
  initDesignFileModel(sequelize);
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
  TypeOfProject,
  Bank,
  Supplier,
  BankAccount,
  Product,
  Purchase,
  PurchaseItem,
  PurchaseNullation,
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
  VisitRequestAudit,

  Project,
  ProjectEvolution,
  ProjectAccount,
  ProjectAccountTransaction,
  ProjectSupplierTransaction,
  RelatedPerson,


  Group,
  Member,
  GroupMember,

  // PROYECTO
  Estimate,
  EstimateEvolution,
  EstimateItem,

  // ENTITIES
  Entity,
  EntityAccount,
  EntityAccountTransaction,

  // ENVIRONMENTS
  Environment,
  Design,
  Fabrication,
  Installation,

  // DESIGN
  DesignComment,
  DesignTask,
  DesignTaskEvolution,
  DesignEvolution,
  DesignFile

};