// mysqlDatabase.ts
import { Sequelize } from "sequelize";
import { initializeModels } from "./models";
import { initializeAssociations } from "./associations";
import { envs } from "../../config";

interface ConnectionOptions {
    database: string;
    username: string;
    password: string;
}

class MysqlSingleton {
    public sequelize: Sequelize | null = null;

    constructor(options: ConnectionOptions) {
        const { database, username, password } = options;

        this.sequelize = new Sequelize(database, username, password, {
            dialect: 'mysql',
            host: 'localhost',
            logging: false
        });

        try {
            this.sequelize.authenticate();
            console.log('Connection has been established successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }

        initializeModels(this.sequelize);
        initializeAssociations();

        this.syncModels();
    }

    async syncModels() {
        if (this.sequelize) {
            await this.sequelize.sync({ force: false }); 
            console.log('Database synchronized.'); 
        } else {
            console.error('No Sequelize instance available.');
        }
    }

}

const connectionOptions: ConnectionOptions = { database: envs.DB_DATABASE, username: envs.DB_USERNAME, password: envs.DB_PASSWORD };
export const mysqlSingleton = new MysqlSingleton(connectionOptions);
