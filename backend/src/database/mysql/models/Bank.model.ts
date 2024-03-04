import { DataTypes, Model, Sequelize } from 'sequelize';

export class Bank extends Model {
    public id!: number;
    public name!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initBankModel = (sequelize: Sequelize) => {
    Bank.init(
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
            modelName: 'Bank',
            tableName: 'banks',
            timestamps: true,
        }
    );
};
