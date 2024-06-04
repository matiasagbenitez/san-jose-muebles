import { DataTypes, Model, Sequelize } from 'sequelize';
import { Client } from './Client.model';
import { Locality } from './Locality.model';
import { ProjectAccount } from './ProjectAccount.model';

export class Project extends Model {
    public id!: number;
    public id_client!: number;
    public title!: string;
    public status!: string;
    public priority!: string;
    public id_locality!: number;
    public address!: string;

    public requested_deadline!: Date;
    public estimated_deadline!: Date;

    public client!: Client;
    public locality!: Locality;

    // ASSOCIATIONS
    public readonly accounts: ProjectAccount[] = [];

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
                allowNull: false,
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
