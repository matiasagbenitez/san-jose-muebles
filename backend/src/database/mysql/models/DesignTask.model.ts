import { DataTypes, Model, Sequelize } from 'sequelize';

export class DesignTask extends Model {
    public id!: number;
    public id_design!: string;
    public status!: string;
    public title!: string;
    public description!: string;
    public id_user!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initDesignTaskModel = (sequelize: Sequelize) => {
    DesignTask.init(
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
                type: DataTypes.STRING,
                allowNull: false,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            id_user: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'DesignTask',
            tableName: 'design_tasks',
            timestamps: true,
        }
    );
};
