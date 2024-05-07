import { DataTypes, Model, Sequelize } from 'sequelize';

export class PurchaseNullation extends Model {
    public id!: number;

    public id_purchase!: number;
    public reason!: string;
    public id_user!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initPurchaseNullationModel = (sequelize: Sequelize) => {
    PurchaseNullation.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            id_purchase: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            reason: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            id_user: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'PurchaseNullation',
            tableName: 'purchases_nullations',
            timestamps: true,
        }
    );
};
