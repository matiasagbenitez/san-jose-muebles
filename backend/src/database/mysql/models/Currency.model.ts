import { DataTypes, Model, Sequelize } from 'sequelize';

export class Currency extends Model {
    public id!: number;
    public name!: string;
    public code!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initCurrencyModel = (sequelize: Sequelize) => {
    Currency.init(
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
            code: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
        },
        {
            sequelize,
            modelName: 'Currency',
            tableName: 'currencies',
            timestamps: true,
        }
    );
};
