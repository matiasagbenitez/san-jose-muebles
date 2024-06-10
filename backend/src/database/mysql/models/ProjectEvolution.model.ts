import { DataTypes, Model, Sequelize } from 'sequelize';

export class ProjectEvolution extends Model {
    public id!: number;
    public id_project!: string;
    public status!: 'PENDIENTE' | 'PROCESO' | 'PAUSADO' | 'FINALIZADO' | 'CANCELADO';
    public id_user!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initProjectEvolutionModel = (sequelize: Sequelize) => {
    ProjectEvolution.init(
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
                type: DataTypes.ENUM('PENDIENTE', 'PROCESO', 'PAUSADO', 'FINALIZADO', 'CANCELADO'),
                allowNull: false,
            },
            comment: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            id_user: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'ProjectEvolution',
            tableName: 'projects_evolutions',
            timestamps: true,
        }
    );
};
