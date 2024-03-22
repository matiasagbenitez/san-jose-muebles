import { DataTypes, Model, Sequelize } from 'sequelize';
import { ReceptionPartial } from './ReceptionPartial.model';
import { Product } from './Product.model';

export class PurchaseItem extends Model {
    public id!: number;
    public id_purchase!: number;
    public id_product!: number;
    public quantity!: number;
    public price!: number;
    public subtotal!: number;
    public actual_stocked!: number;
    public fully_stocked!: boolean;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // relationships
    public receptions: ReceptionPartial[] | undefined;
    public product!: Product;
}

export const initPurchaseItemModel = (sequelize: Sequelize) => {
    PurchaseItem.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            id_purchase: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            quantity: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            id_product: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            subtotal: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            actual_stocked: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            fully_stocked: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },

        },
        {
            sequelize,
            modelName: 'PurchaseItem',
            tableName: 'purchase_items',
            timestamps: true,
        }
    );
};
