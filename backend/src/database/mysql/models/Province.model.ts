import { DataTypes, Model, Sequelize } from 'sequelize';
import { Country } from './Country.model';
import { Locality } from './Locality.model';

export class Province extends Model {
    public id!: number;
    public name!: string;
    public id_country!: number;

    public readonly country!: Country;
    public readonly localities?: Locality[];

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initProvinceModel = (sequelize: Sequelize) => {
    Province.init(
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
            id_country: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Province',
            tableName: 'provinces',
            timestamps: true,
        }
    );
};
