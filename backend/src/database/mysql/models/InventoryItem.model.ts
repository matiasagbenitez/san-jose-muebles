import { DataTypes, Model, Sequelize } from 'sequelize';

export class InventoryItem extends Model {
    public id!: number;

    public id_inventory_categ!: number;
    public id_inventory_brand!: number;

    public status!: 'RESERVADO' | 'OPERATIVO' | 'RETIRADO' | 'DESCARTADO';
    public code!: string;
    public name!: string;

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
            status: {
                type: DataTypes.ENUM('RESERVADO', 'OPERATIVO', 'RETIRADO', 'DESCARTADO'),
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
        },
        {
            sequelize,
            modelName: 'InventoryItem',
            tableName: 'inventory_items',
            timestamps: true,
        }
    );
};
