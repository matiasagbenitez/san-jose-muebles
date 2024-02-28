import { DataTypes, Model, Sequelize } from 'sequelize';
import { Province } from './Province.model';

export class Country extends Model {
    public id!: number;
    public name!: string;

    public readonly provinces?: Province[];

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initCountryModel = (sequelize: Sequelize) => {
    Country.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
        },
        {
            sequelize,
            modelName: 'Country',
            tableName: 'countries',
            timestamps: true,
        }
    );
};
