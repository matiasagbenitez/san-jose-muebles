import { DataTypes, Model, Sequelize } from 'sequelize';

export class InventoryItem extends Model {
    public id!: number;
    public id_inventory_categ!: number;
    public id_inventory_brand!: number;
    public quantity!: number;
    public code!: string;
    public name!: string;

    public last_check_at!: Date;
    public last_check_by!: number;

    public is_retired!: boolean;

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
            quantity: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            code: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            last_check_at: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            last_check_by: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            is_retired: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
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
