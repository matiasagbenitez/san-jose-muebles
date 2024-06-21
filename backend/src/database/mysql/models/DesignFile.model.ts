import { DataTypes, Model, Sequelize } from 'sequelize';

export class DesignFile extends Model {
    public id!: number;
    public id_design!: number;

    public description!: string;
    public slug!: string;
    public path!: string;
    public size!: number;
    public mimetype!: string;
    public image!: boolean;
    public id_user!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initDesignFileModel = (sequelize: Sequelize) => {
    DesignFile.init(
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
            description: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            slug: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            path: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            size: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            mimetype: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            image: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
            id_user: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'DesignFile',
            tableName: 'design_files',
            timestamps: true,
        }
    );
};
