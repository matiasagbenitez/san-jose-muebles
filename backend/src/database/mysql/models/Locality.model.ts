import { DataTypes, Model, Sequelize } from 'sequelize';

export class Locality extends Model {
    public id!: number;
    public name!: string;
    public id_province!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initLocalityModel = (sequelize: Sequelize) => {
    Locality.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            name: { 
                type: DataTypes.STRING,
                allowNull: false,
                unique: 'uniqueLocalityNameInProvince'
            },
            id_province: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                unique: 'uniqueLocalityNameInProvince'
            },
        },
        {
            sequelize,
            modelName: 'Locality',
            tableName: 'localities',
            timestamps: true,
        }
    );
};
