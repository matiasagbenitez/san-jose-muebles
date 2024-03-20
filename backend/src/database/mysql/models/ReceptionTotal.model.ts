import { DataTypes, Model, Sequelize } from 'sequelize';

export class ReceptionTotal extends Model {
    public id!: number;
    public id_purchase!: number;
    public id_user!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initReceptionTotalModel = (sequelize: Sequelize) => {
    ReceptionTotal.init(
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
            id_user: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'ReceptionTotal',
            tableName: 'reception_totals',
            timestamps: true,
        }
    );
};
