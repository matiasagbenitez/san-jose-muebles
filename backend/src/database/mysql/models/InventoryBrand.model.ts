import { DataTypes, Model, Sequelize } from 'sequelize';

export class InventoryBrand extends Model {
    public id!: number;
    public name!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initInventoryBrandModel = (sequelize: Sequelize) => {
    InventoryBrand.init(
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
            modelName: 'InventoryBrand',
            tableName: 'inventory_brands',
            timestamps: true,
        }
    );
};
