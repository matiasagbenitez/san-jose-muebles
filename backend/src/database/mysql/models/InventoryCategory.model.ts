import { DataTypes, Model, Sequelize } from 'sequelize';

export class InventoryCategory extends Model {
    public id!: number;
    public name!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initInventoryCategoryModel = (sequelize: Sequelize) => {
    InventoryCategory.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
        },
        {
            sequelize,
            modelName: 'InventoryCategory',
            tableName: 'inventory_categories',
            timestamps: true,
        }
    );
};
