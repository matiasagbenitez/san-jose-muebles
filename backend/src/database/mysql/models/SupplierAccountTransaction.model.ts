import { DataTypes, Model, Sequelize } from 'sequelize';

export class SupplierAccountTransaction extends Model {
    public id!: number;
    public id_supplier_account!: number;
    public type!: 'NEW_PURCHASE' | 'DEL_PURCHASE' | 'NEW_PAYMENT' | 'POS_ADJ' | 'NEG_ADJ' | 'NEW_CLIENT_PAYMENT' | 'DEL_CLIENT_PAYMENT';
    public description!: string;
    public prev_balance!: number;
    public amount!: number;
    public post_balance!: number;
    public id_user!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initSupplierAccountTransactionModel = (sequelize: Sequelize) => {
    SupplierAccountTransaction.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            id_supplier_account: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            type: {
                type: DataTypes.ENUM('NEW_PURCHASE', 'DEL_PURCHASE', 'NEW_PAYMENT', 'POS_ADJ', 'NEG_ADJ', 'NEW_CLIENT_PAYMENT', 'DEL_CLIENT_PAYMENT'),
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING(200),
            },
            prev_balance: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
            },
            amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
            },
            post_balance: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
            },
            id_user: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'SupplierAccountTransaction',
            tableName: 'supplier_account_transactions',
            timestamps: true,
        }
    );
};
