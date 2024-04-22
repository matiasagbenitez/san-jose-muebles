import { DataTypes, Model, Sequelize } from 'sequelize';

export class VisitRequest extends Model {
    public id!: number;
    public id_visit_reason!: number;
    public visible_for!: 'ALL' | 'ADMIN';
    public status!: 'PENDIENTE' | 'REALIZADA' | 'CANCELADA';
    public priority!: 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE';
    public id_client!: number;
    public id_locality!: number;
    public address!: string;

    public title!: string;
    public description!: string;
    public start!: Date;
    public end!: Date;

    // public no_duration!: boolean;
    
    public id_user!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initVisitRequestModel = (sequelize: Sequelize) => {
    VisitRequest.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            id_visit_reason: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            visible_for: {
                type: DataTypes.ENUM('ALL', 'ADMIN'),
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM('PENDIENTE', 'REALIZADA', 'CANCELADA'),
                allowNull: false,
            },
            priority: {
                type: DataTypes.ENUM('BAJA', 'MEDIA', 'ALTA', 'URGENTE'),
                allowNull: false,
            },
            id_client: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            id_locality: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            address: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            start: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            end: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            // no_duration: {
            //     type: DataTypes.BOOLEAN,
            //     allowNull: false,
            //     defaultValue: false,
            // },
            id_user: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
        },
        {
            sequelize,
            paranoid: true,
            modelName: 'VisitRequest',
            tableName: 'visit_requests',
            timestamps: true,
        }
    );
};
