import { envs } from './config/envs';
import { MysqlDatabase } from './database';
import { Server } from './presentation/server';
import { AppRoutes } from './presentation/routes';

(async () => {
  main();
})();

async function main() {

  new MysqlDatabase({
    database: envs.DB_DATABASE,
    username: envs.DB_USERNAME,
    password: envs.DB_PASSWORD
  });

  const server = new Server({
    port: envs.PORT,
    routes: AppRoutes.routes,
  });

  server.start();
}