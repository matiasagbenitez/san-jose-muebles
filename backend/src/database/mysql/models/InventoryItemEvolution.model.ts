import { DataTypes, Model, Sequelize } from 'sequelize';

export class InventoryItemEvolution extends Model {
    public id!: number;

    public id_inventory_item!: number;
    public status!: 'RESERVADO' | 'OPERATIVO' | 'RETIRADO' | 'DESCARTADO';
    public comment!: string;
    public id_user!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initInventoryItemEvolutionModel = (sequelize: Sequelize) => {
    InventoryItemEvolution.init(
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
            status: {
                type: DataTypes.ENUM('RESERVADO', 'OPERATIVO', 'RETIRADO', 'DESCARTADO'),
                allowNull: false,
            },
            comment: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            id_user: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'InventoryItemEvolution',
            tableName: 'inventory_items_evolutions',
            timestamps: true,
        }
    );
};
