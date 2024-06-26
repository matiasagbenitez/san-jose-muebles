import { DataTypes, Model, Sequelize } from 'sequelize';

export class Design extends Model {
    public id!: number;
    public id_environment!: string;
    public status!: 'PENDIENTE' | 'PROCESO' | 'PAUSADO' | 'PRESENTAR' | 'PRESENTADO' | 'REVISION' | 'FINALIZADO' | 'CANCELADO';

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initDesignModel = (sequelize: Sequelize) => {
    Design.init(
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
                type: DataTypes.ENUM('PENDIENTE', 'PROCESO', 'PAUSADO', 'PRESENTAR', 'PRESENTADO', 'REVISION', 'FINALIZADO', 'CANCELADO'),
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Design',
            tableName: 'designs',
            timestamps: true,
        }
    );
};
