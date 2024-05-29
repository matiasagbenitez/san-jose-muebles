import { DataTypes, Model, Sequelize } from 'sequelize';

export class Fabrication extends Model {
    public id!: number;
    public id_environment!: string;
    public status!: 'PENDIENTE' | 'PROCESO' | 'PAUSADO' | 'FINALIZADO' | 'CANCELADO';
    public description!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initFabricationModel = (sequelize: Sequelize) => {
    Fabrication.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            id_environment: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                unique: true,
            },
            status: {
                type: DataTypes.ENUM('PENDIENTE', 'PROCESO', 'PAUSADO', 'FINALIZADO', 'CANCELADO'),
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
            },
        },
        {
            sequelize,
            modelName: 'Fabrication',
            tableName: 'fabrications',
            timestamps: true,
        }
    );
};
