import { DataTypes, Model, Sequelize } from 'sequelize';

export class Product extends Model {
    public id!: number;
    public code!: string;
    public name!: string;
    public description!: string;
    public id_brand!: number;
    public id_category!: number;
    public id_unit!: number;
    public actual_stock!: number;
    public inc_stock!: number;
    public min_stock!: number;
    public ideal_stock!: number;
    public last_price!: number;
    public id_currency!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date; 
}

export const initProductModel = (sequelize: Sequelize) => {
    Product.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            code: {
                type: DataTypes.STRING,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
            },
            id_brand: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            id_category: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            id_unit: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            actual_stock: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                defaultValue: 0,
            },
            inc_stock: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                defaultValue: 0,
            },
            min_stock: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                defaultValue: 0,
            },
            ideal_stock: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                defaultValue: 0,
            },
            last_price: { 
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
            },
            id_currency: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Product',
            tableName: 'products',
            timestamps: true,
        }
    );
};
