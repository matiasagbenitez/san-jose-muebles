import { DataTypes, Model, Sequelize } from 'sequelize';

export class TypeOfProject extends Model {
    public id!: number;
    public name!: string;
    public description!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initTypeOfProjectModel = (sequelize: Sequelize) => {
    TypeOfProject.init(
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
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'TypeOfProject',
            tableName: 'types_of_projects',
            timestamps: true,
        }
    );
};
