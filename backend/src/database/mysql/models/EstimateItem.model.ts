import { DataTypes, Model, Sequelize } from 'sequelize';

export class EstimateItem extends Model {
    public id!: number;

    public id_estimate!: number;
    public quantity!: number;
    public description!: string;
    public price!: number;
    public subtotal!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initEstimateItemModel = (sequelize: Sequelize) => {
    EstimateItem.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            id_estimate: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            quantity: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },  
            description: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            subtotal: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },  
        },
        {
            sequelize,
            modelName: 'EstimateItem',
            tableName: 'estimates_items',
            timestamps: true,
        }
    );
};
