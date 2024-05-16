import { DataTypes, Model, Sequelize } from 'sequelize';

export class EstimateEvolution extends Model {
    public id!: number;

    public id_estimate!: number;
    public status!: 'ACEPTADO' | 'PENDIENTE' | 'RECHAZADO';
    public comment!: string;

    public id_user!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initEstimateEvolutionModel = (sequelize: Sequelize) => {
    EstimateEvolution.init( 
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            id_estimate: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM('ACEPTADO', 'PENDIENTE', 'RECHAZADO'),
                allowNull: false,
            },
            comment: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            id_user: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'EstimateEvolution',
            tableName: 'estimates_evolutions',
            timestamps: true,
        }
    );
};
