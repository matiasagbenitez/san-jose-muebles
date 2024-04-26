import { DataTypes, Model, Sequelize } from 'sequelize';

export class ProjectAccount extends Model {
    public id!: number;
    public id_project!: number;
    public id_currency!: number;
    public balance!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initProjectAccountModel = (sequelize: Sequelize) => {
    ProjectAccount.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            id_project: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                unique: 'id_project_id_currency',
            },
            id_currency: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                unique: 'id_project_id_currency',
            },
            balance: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
            },
        },
        {
            sequelize,
            modelName: 'ProjectAccount',
            tableName: 'project_accounts',
            timestamps: true,
        }
    );
};
