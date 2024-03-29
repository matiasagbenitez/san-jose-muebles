import { DataTypes, Model, Sequelize } from 'sequelize';

export class SupplierAccountTransaction extends Model {
    public id!: number;
    public id_supplier_account!: number;
    public date!: Date;
    public isCancellation!: boolean;
    public description!: string;
    public amount_in!: number;
    public amount_out!: number;
    public balance!: number;
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
            date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            isCancellation: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            description: {
                type: DataTypes.STRING(200),
            },
            amount_in: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
            },
            amount_out: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
            },
            balance: {
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
