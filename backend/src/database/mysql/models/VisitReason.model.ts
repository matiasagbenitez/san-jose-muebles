import { DataTypes, Model, Sequelize } from 'sequelize';

export class VisitReason extends Model {
    public id!: number;
    public name!: string;
    public color!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initVisitReasonModel = (sequelize: Sequelize) => {
    VisitReason.init(
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
            color: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
        },
        {
            sequelize,
            modelName: 'VisitReason',
            tableName: 'visit_reasons',
            timestamps: true,
        }
    );
};