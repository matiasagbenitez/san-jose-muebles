import { DataTypes, Model, Sequelize } from 'sequelize';

export class Environment extends Model {
    public id!: number;
    public id_project!: number; 
    public id_type_of_environment!: number;

    public difficulty!: 'BAJA' | 'MEDIA' | 'ALTA';
    public priority!: 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE';
    public description!: string;

    public req_deadline!: Date;
    public est_deadline!: Date;

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
            difficulty: {
                type: DataTypes.ENUM('BAJA', 'MEDIA', 'ALTA'),
                allowNull: false,
            },
            priority: {
                type: DataTypes.ENUM('BAJA', 'MEDIA', 'ALTA', 'URGENTE'),
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
        },
        {
            sequelize,
            modelName: 'Environment',
            tableName: 'environments',
            timestamps: true,
        }
    );
};
