import { DataTypes, Model, Sequelize } from 'sequelize';

export class InventoryItem extends Model {
    public id!: number;
    public id_inventory_categ!: number;
    public id_inventory_brand!: number;
    public code!: string;
    public name!: string;
    public comment!: string;
    public is_retired!: boolean;
    public last_check!: Date;
    public last_check_by!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initInventoryItemModel = (sequelize: Sequelize) => {
    InventoryItem.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            id_inventory_categ: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            id_inventory_brand: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            code: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            is_retired: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            last_check: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            last_check_by: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'InventoryItem',
            tableName: 'inventory_items',
            timestamps: true,
        }
    );
};
