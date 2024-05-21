import { DataTypes, Model, Sequelize } from 'sequelize';

export class EntityAccount extends Model {
    public id!: number;
    public id_entity!: number;
    public id_currency!: number;
    public balance!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initEntityAccountModel = (sequelize: Sequelize) => {
    EntityAccount.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            id_entity: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                unique: 'id_entity_id_currency',
            },
            id_currency: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                unique: 'id_entity_id_currency',
            },
            balance: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
            },
        },
        {
            sequelize,
            modelName: 'EntityAccount',
            tableName: 'entity_accounts',
            timestamps: true,
        }
    );
};
