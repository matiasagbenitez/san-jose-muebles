import { DataTypes, Model, Sequelize } from 'sequelize';

export class DesignEvolution extends Model {
    public id!: number;
    public id_design!: string;
    public status!: 'PENDIENTE' | 'PROCESO' | 'PAUSADO' | 'PRESENTADO' | 'CAMBIOS' | 'FINALIZADO' | 'CANCELADO';
    public id_user!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initDesignEvolutionModel = (sequelize: Sequelize) => {
    DesignEvolution.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            id_design: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM('PENDIENTE', 'PROCESO', 'PAUSADO', 'PRESENTADO', 'CAMBIOS', 'FINALIZADO', 'CANCELADO'),
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
            modelName: 'DesignEvolution',
            tableName: 'designs_evolution',
            timestamps: true,
        }
    );
};
