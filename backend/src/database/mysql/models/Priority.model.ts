import { DataTypes, Model, Sequelize } from 'sequelize';

export class Priority extends Model {
    public id!: number;
    public name!: string;
    public color!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initPriorityModel = (sequelize: Sequelize) => {
    Priority.init(
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
            modelName: 'Priority',
            tableName: 'priorities',
            timestamps: true,
        }
    );
};