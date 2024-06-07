import { DataTypes, Model, Sequelize } from 'sequelize';

export class DesignTaskEvolution extends Model {
    public id!: number;
    public id_design_task!: string;
    public status!: "PENDIENTE" | "PROCESO" | "FINALIZADA" | "ARCHIVADA";
    public id_user!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initDesignTaskEvolutionModel = (sequelize: Sequelize) => {
    DesignTaskEvolution.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            id_design_task: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM("PENDIENTE", "PROCESO", "FINALIZADA", "ARCHIVADA"),
                allowNull: false,
            },
            id_user: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'DesignTaskEvolution',
            tableName: 'design_task_evolutions',
            timestamps: true,
        }
    );
};
