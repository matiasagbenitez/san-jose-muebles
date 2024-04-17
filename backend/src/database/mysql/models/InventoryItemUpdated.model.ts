import { DataTypes, Model, Sequelize } from 'sequelize';

export class InventoryItemUpdated extends Model {
    public id!: number;
    public id_inventory_item!: number;
    public prev_quantity!: number;
    public new_quantity!: number;
    public updated_by!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initInventoryItemUpdatedModel = (sequelize: Sequelize) => {
    InventoryItemUpdated.init(
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
            prev_quantity: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            new_quantity: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            updated_by: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'InventoryItemUpdated',
            tableName: 'inventory_items_updated',
            timestamps: true,
        }
    );
};
