import { DataTypes, Model, Sequelize } from 'sequelize';

export class PurchaseItem extends Model {
    public id!: number;
    public id_purchase!: number;
    public id_product!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
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