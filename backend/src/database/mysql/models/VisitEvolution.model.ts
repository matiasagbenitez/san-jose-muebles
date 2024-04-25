import { DataTypes, Model, Sequelize } from 'sequelize';

export class VisitEvolution extends Model {
    public id!: number;
    public id_visit_request!: number;
    public status!: string;
    public id_user!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initVisitEvolutionModel = (sequelize: Sequelize) => {
    VisitEvolution.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            id_visit_request: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM('PENDIENTE', 'REALIZADA', 'CANCELADA'),
                allowNull: false,
            },
            id_user: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'VisitEvolution',
            tableName: 'visit_evolutions',
            timestamps: true,
        }
    );
};