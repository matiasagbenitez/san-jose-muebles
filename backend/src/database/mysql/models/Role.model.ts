import { DataTypes, Model, Sequelize } from 'sequelize';

export class Role extends Model {
    public id!: number;
    public name!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initRoleModel = (sequelize: Sequelize) => {
    Role.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                // type: DataTypes.ENUM('ADMIN', 'USER'),
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Role',
            tableName: 'roles',
            timestamps: true,
        }
    );
};
