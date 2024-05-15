import { DataTypes, Model, Sequelize } from 'sequelize';

export class Estimate extends Model {
    public id!: number;
    public id_project!: number;
    public status!: 'VALIDO' | 'ENVIADO' | 'ACEPTADO' | 'RECHAZADO' | 'ANULADO' ;
    public gen_date!: Date;
    public val_date!: Date;

    public client_name!: string;
    public title!: string;

    public id_currency!: number;
    public subtotal!: number;
    public discount!: number;
    public fees!: number;
    public total!: number;

    public guarantee!: string;
    public annotations!: string;

    public id_user!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initEstimateModel = (sequelize: Sequelize) => {
    Estimate.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            id_project: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM('VALIDO', 'ANULADO', 'ACEPTADO', 'RECHAZADO'),
                allowNull: false,
            },
            gen_date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            val_date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            client_name: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            title: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            id_currency: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            subtotal: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            discount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            fees: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            total: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            guarantee: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            annotations: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            id_user: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Estimate',
            tableName: 'estimates',
            timestamps: true,
        }
    );
};
