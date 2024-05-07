import { DataTypes, Model, Sequelize } from 'sequelize';
import { PurchaseItem } from './PurchaseItem.model';
import { ReceptionTotal } from './ReceptionTotal.model';
import { Supplier } from './Supplier.model';

export class Purchase extends Model {
    public id!: number;
    public status!: 'VALIDA' | 'ANULADA';
    public date!: Date;
    public id_supplier!: number;

    public id_currency!: number;
    public subtotal!: number;
    public discount!: number;
    public other_charges!: number;
    public total!: number;

    public fully_stocked!: boolean;
    public id_user!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // ASSOCIATIONS
    public items: PurchaseItem[] | undefined;
    public reception: ReceptionTotal | undefined;
    public supplier!: Supplier;
}

export const initPurchaseModel = (sequelize: Sequelize) => {
    Purchase.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            status: {
                type: DataTypes.ENUM('VALIDA', 'ANULADA'),
                allowNull: false,
            },
            date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            id_supplier: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            id_currency: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            subtotal: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            discount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            other_charges: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            total: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            fully_stocked: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
            id_user: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
        },
        {
            sequelize,
            // paranoid: true,
            modelName: 'Purchase',
            tableName: 'purchases',
            timestamps: true,
        }
    );
};
