import { Sequelize } from 'sequelize';
import { User, initUserModel } from './User.model';
import { Role, initRoleModel } from './Role.model';
import { RoleUser, initRoleUserModel } from './RoleUser.model';
import { Country, initCountryModel } from './Country.model';
import { Province, initProvinceModel } from './Province.model';
import { City, initCityModel } from './City.model';
import { Currency, initCurrencyModel } from './Currency.model';
import { PaymentMethod, initPaymentMethodModel } from './PaymentMethod.model';
import { TypeOfEnvironment, initTypeOfEnvironmentModel } from './TypeOfEnvironment';
import { Brand, initBrandModel } from './Brand.model';
import { Category, initCategoryModel} from './Category.model';

export const initializeModels = (sequelize: Sequelize) => {
  initUserModel(sequelize);
  initRoleModel(sequelize);
  initRoleUserModel(sequelize);
  initCountryModel(sequelize);
  initProvinceModel(sequelize);
  initCityModel(sequelize);
  initCurrencyModel(sequelize);
  initPaymentMethodModel(sequelize);
  initTypeOfEnvironmentModel(sequelize);
  initBrandModel(sequelize);
  initCategoryModel(sequelize);
};

export {
  User,
  Role,
  RoleUser,
  Country,
  Province,
  City,
  Currency,
  PaymentMethod,
  TypeOfEnvironment,
  Brand,
  Category,
};