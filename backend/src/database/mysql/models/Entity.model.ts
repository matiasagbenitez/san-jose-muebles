import { DataTypes, Model, Sequelize } from 'sequelize';
import { Locality } from './Locality.model';

export class Entity extends Model {
    public id!: number;
    public name!: string;
    public dni_cuit!: string;
    public phone!: string;
    public email!: string;
    public address!: string;
    public id_locality!: number;
    public annotations!: string;

    public locality!: Locality;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initEntityModel = (sequelize: Sequelize) => {
    Entity.init(
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
            dni_cuit: {
                type: DataTypes.STRING,
            },
            phone: {
                type: DataTypes.STRING,
            },
            email: {
                type: DataTypes.STRING,
            },
            address: {
                type: DataTypes.STRING,
            },
            id_locality: {
                type: DataTypes.INTEGER.UNSIGNED,
            },
            annotations: {
                type: DataTypes.TEXT,
            },
        },
        {
            sequelize,
            modelName: 'Entity',
            tableName: 'entities',
            timestamps: true,
        }
    );
};
