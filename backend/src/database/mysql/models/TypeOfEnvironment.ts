import { DataTypes, Model, Sequelize } from 'sequelize';

export class TypeOfEnvironment extends Model {
    public id!: number;
    public name!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initTypeOfEnvironmentModel = (sequelize: Sequelize) => {
    TypeOfEnvironment.init(
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
        },
        {
            sequelize,
            modelName: 'TypeOfEnvironment',
            tableName: 'type_of_environments',
            timestamps: true,
        }
    );
};
