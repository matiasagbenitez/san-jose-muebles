import { DataTypes, Model, Sequelize } from 'sequelize';

export class Environment extends Model {
    public id!: number;
    public id_project!: number;
    public id_type_of_environment!: number;

    public status!: 'PENDIENTE' | 'PROCESO' | 'PAUSADO' | 'FINALIZADO' | 'CANCELADO';
    public description!: string;

    public req_deadline!: Date;
    public est_deadline!: Date;

    public des_status!: 'PENDIENTE' | 'PROCESO' | 'PAUSADO' | 'FINALIZADO' | 'CANCELADO';
    public fab_status!: 'PENDIENTE' | 'PROCESO' | 'PAUSADO' | 'FINALIZADO' | 'CANCELADO';
    public ins_status!: 'PENDIENTE' | 'PROCESO' | 'PAUSADO' | 'FINALIZADO' | 'CANCELADO';

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initEnvironmentModel = (sequelize: Sequelize) => {
    Environment.init(
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
            id_type_of_environment: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM('PENDIENTE', 'PROCESO', 'PAUSADO', 'FINALIZADO', 'CANCELADO'),
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            req_deadline: {
                type: DataTypes.DATEONLY,
            },
            est_deadline: {
                type: DataTypes.DATEONLY, 
            },
            des_status: {
                type: DataTypes.ENUM('PENDIENTE', 'PROCESO', 'PAUSADO', 'FINALIZADO', 'CANCELADO'),
                allowNull: false,
            },
            fab_status: {
                type: DataTypes.ENUM('PENDIENTE', 'PROCESO', 'PAUSADO', 'FINALIZADO', 'CANCELADO'),
                allowNull: false,
            },
            ins_status: {
                type: DataTypes.ENUM('PENDIENTE', 'PROCESO', 'PAUSADO', 'FINALIZADO', 'CANCELADO'),
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Environment',
            tableName: 'environments',
            timestamps: true,
        }
    );
};
