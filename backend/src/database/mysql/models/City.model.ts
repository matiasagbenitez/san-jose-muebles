import { DataTypes, Model, Sequelize } from 'sequelize';

export class City extends Model {
    public id!: number;
    public name!: string;
    public id_province!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initCityModel = (sequelize: Sequelize) => {
    City.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            id_province: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'City',
            tableName: 'cities',
            timestamps: true,
        }
    );
};
