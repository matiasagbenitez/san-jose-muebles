import { DataTypes, Model, Sequelize } from 'sequelize';

export class ProjectSupplierTransaction extends Model {
    public id!: number;
    public id_project_account_transaction!: number;
    public id_supplier_account_transaction!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initProjectSupplierTransactionModel = (sequelize: Sequelize) => {
    ProjectSupplierTransaction.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            id_project_account_transaction: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            id_supplier_account_transaction: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'ProjectSupplierTransaction',
            tableName: 'project_supplier_transactions',
            timestamps: true,
        }
    );
};
