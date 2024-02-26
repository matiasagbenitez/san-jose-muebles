import { DataTypes, Model, Sequelize } from 'sequelize';

export class RoleUser extends Model {
    public id!: number;
    public id_user!: number;
    public id_role!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initRoleUserModel = (sequelize: Sequelize) => {
    RoleUser.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            id_user: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            id_role: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'RoleUser',
            tableName: 'roles_users',
            timestamps: true,
        }
    );
};
