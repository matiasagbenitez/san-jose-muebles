import { DataTypes, Model, Sequelize } from 'sequelize';

export class Project extends Model {
    public id!: number;
    public id_client!: number;
    public title!: string;
    public status!: string;
    public priority!: string;
    public id_locality!: number;
    public address!: string;

    public env_total!: number;
    public env_des!: number;
    public env_fab!: number;
    public env_ins!: number;

    public requested_deadline!: Date;
    public estimated_deadline!: Date;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initProjectModel = (sequelize: Sequelize) => {
    Project.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            id_client: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            title: {
                type: DataTypes.STRING,
            },
            status: {
                // type: DataTypes.ENUM('PENDIENTE', 'PROCESO', 'PAUSADO', 'FINALIZADO', 'CANCELADO'),
                type: DataTypes.ENUM('PROCESO', 'PENDIENTE', 'PAUSADO', 'FINALIZADO', 'CANCELADO'),
                allowNull: false,
            },
            priority: {
                type: DataTypes.ENUM('BAJA', 'MEDIA', 'ALTA', 'URGENTE'),
                allowNull: false,
            },
            id_locality: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            address: {
                type: DataTypes.STRING,
            },
            env_total: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            env_des: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            env_fab: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            env_ins: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            requested_deadline: {
                type: DataTypes.DATEONLY,
            },
            estimated_deadline: {
                type: DataTypes.DATEONLY,
            }
        },
        {
            sequelize,
            modelName: 'Project',
            tableName: 'projects',
            timestamps: true,
        }
    );
};
