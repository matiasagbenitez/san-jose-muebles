import { DataTypes, Model, Sequelize } from 'sequelize';

export class ReceptionPartial extends Model {
    public id!: number;
    public id_purchase_item!: number;
    public quantity_received!: number;
    public id_user!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initReceptionPartialModel = (sequelize: Sequelize) => {
    ReceptionPartial.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            id_purchase_item: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            quantity_received: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            id_user: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'ReceptionPartial',
            tableName: 'reception_partials',
            timestamps: true,
        }
    );
};
