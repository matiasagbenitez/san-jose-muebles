import { DataTypes, Model, Sequelize } from 'sequelize';

export class StockLot extends Model {
    public id!: number;
    public type!: 'INCREMENT' | 'DECREMENT';
    public description!: string;
    public total_items!: number;
    public id_user!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initStockLotModel = (sequelize: Sequelize) => {
    StockLot.init( 
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            type: {
                type: DataTypes.ENUM('INCREMENT', 'DECREMENT'),
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            total_items: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            id_user: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'StockLot',
            tableName: 'stock_lots',
            timestamps: true,
        }
    );
};
