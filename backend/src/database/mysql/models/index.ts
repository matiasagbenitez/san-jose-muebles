import { Sequelize } from 'sequelize';
import { User, initUserModel } from './User.model';
import { Role, initRoleModel } from './Role.model';
import { RoleUser, initRoleUserModel } from './RoleUser.model';
import { Country, initCountryModel } from './Country.model';
import { Province, initProvinceModel } from './Province.model';
import { City, initCityModel } from './City.model';

export const initializeModels = (sequelize: Sequelize) => {
  initUserModel(sequelize);
  initRoleModel(sequelize);
  initRoleUserModel(sequelize);
  initCountryModel(sequelize);
  initProvinceModel(sequelize);
  initCityModel(sequelize);
};

export {
  User,
  Role,
  RoleUser,
  Country,
  Province,
  City,
};