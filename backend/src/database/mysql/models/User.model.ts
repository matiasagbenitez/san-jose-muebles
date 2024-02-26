import { DataTypes, Model, Sequelize } from 'sequelize';
import { Role } from './Role.model';

export class User extends Model {
    public id!: number;
    public name!: string;
    public username!: string;
    public email!: string;
    public password!: string;
    public phone!: string;

    public readonly roles?: Role[];

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initUserModel = (sequelize: Sequelize) => {
    User.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            username: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
            },
            email: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            phone: {
                type: DataTypes.STRING(20),
            },
        },
        {
            sequelize,
            modelName: 'User',
            tableName: 'users',
            timestamps: true,
        }
    );
};
