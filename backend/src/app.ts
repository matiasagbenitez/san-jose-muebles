import { envs } from './config/envs';
import { MysqlDatabase, mysqlSingleton } from './database';

import { Server } from './presentation/server';
import { AppRoutes } from './presentation/routes';

(async () => {
  main();
})();

async function main() {

  // new MysqlDatabase({
  //   database: envs.DB_DATABASE,
  //   username: envs.DB_USERNAME,
  //   password: envs.DB_PASSWORD
  // });

  mysqlSingleton.sequelize;
 
  const server = new Server({
    port: envs.PORT,
    routes: AppRoutes.routes,
  });

  server.start();
}