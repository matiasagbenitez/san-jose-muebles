import { DataTypes, Model, Sequelize } from 'sequelize';

export class Estimate extends Model {
    public id!: number;
    public id_project!: number;
    public status!: 'NO_ENVIADO' | 'ENVIADO' | 'ACEPTADO' | 'RECHAZADO';
    public gen_date!: Date;
    public val_date!: Date;

    public client_name!: string;
    public title!: string;
    public description!: string;

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
                type: DataTypes.ENUM('NO_ENVIADO', 'ENVIADO', 'ACEPTADO', 'RECHAZADO'),
                allowNull: false,
                defaultValue: 'NO_ENVIADO'
            },
            gen_date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            val_date: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            client_name: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            title: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
            },
            id_currency: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            subtotal: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
            },
            discount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
            },
            fees: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
            },
            total: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
            },
            guarantee: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            annotations: {
                type: DataTypes.STRING(255),
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
