import { DataTypes, Model, Sequelize } from 'sequelize';

export class InventoryItemRetired extends Model {
    public id!: number;
    public id_inventory_item!: number;
    public reason!: string;
    public retired_by!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initInventoryItemRetiredModel = (sequelize: Sequelize) => {
    InventoryItemRetired.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            id_inventory_item: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            reason: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            retired_by: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'InventoryItemRetired',
            tableName: 'inventory_items_retired',
            timestamps: true,
        }
    );
};
