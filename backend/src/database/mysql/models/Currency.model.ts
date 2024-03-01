import { DataTypes, Model, Sequelize } from 'sequelize';

export class Currency extends Model {
    public id!: number;
    public name!: string;
    public symbol!: string;
    public is_monetary!: boolean;

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
            symbol: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            is_monetary: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
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
