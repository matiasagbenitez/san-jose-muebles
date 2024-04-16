import { DataTypes, Model, Sequelize } from 'sequelize';

export class StockAdjust extends Model {
    public id!: number;
    public id_product!: string;
    public prev_stock!: number;
    public quantity!: number;
    public post_stock!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initStockAdjustModel = (sequelize: Sequelize) => {
    StockAdjust.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            id_product: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            prev_stock: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            quantity: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            post_stock: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            comment: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            id_user: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'StockAdjust',
            tableName: 'stock_adjusts',
            timestamps: true,
        }
    );
};
