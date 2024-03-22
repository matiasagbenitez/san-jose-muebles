import { DataTypes, Model, Sequelize } from 'sequelize';

export class PurchaseTransaction extends Model {
    public id!: number;
    public id_supplier_account_transaction!: number;
    public id_purchase!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initPurchaseTransactionModel = (sequelize: Sequelize) => {
    PurchaseTransaction.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            id_supplier_account_transaction: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            id_purchase: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'PurchaseTransaction',
            tableName: 'purchase_transactions',
            timestamps: true,
        }
    );
};
