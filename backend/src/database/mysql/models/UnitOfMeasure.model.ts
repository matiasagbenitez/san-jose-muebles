import { DataTypes, Model, Sequelize } from 'sequelize';

export class UnitOfMeasure extends Model {
    public id!: number;
    public name!: string;
    public symbol!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initUnitOfMeasureModel = (sequelize: Sequelize) => {
    UnitOfMeasure.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            symbol: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
        },
        {
            sequelize,
            modelName: 'UnitOfMeasure',
            tableName: 'units_of_measure',
            timestamps: true,
        }
    );
};
