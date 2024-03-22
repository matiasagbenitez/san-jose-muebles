import { DataTypes, Model, Sequelize } from 'sequelize';

export class SupplierAccount extends Model {
    public id!: number;
    public id_supplier!: number;
    public id_currency!: number;
    public balance!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initSupplierAccountModel = (sequelize: Sequelize) => {
    SupplierAccount.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            id_supplier: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                unique: 'id_supplier_id_currency',
            },
            id_currency: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                unique: 'id_supplier_id_currency',
            },
            balance: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
            },
        },
        {
            sequelize,
            modelName: 'SupplierAccount',
            tableName: 'supplier_accounts',
            timestamps: true,
        }
    );
};
