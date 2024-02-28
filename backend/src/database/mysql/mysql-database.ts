import { Sequelize } from "sequelize";
import { initializeModels } from "./models";
import { initializeAssociations } from "./associations";

interface ConnectionOptions {
    database: string;
    username: string;
    password: string;
}

export class MysqlDatabase {

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