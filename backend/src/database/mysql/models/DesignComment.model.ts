import { DataTypes, Model, Sequelize } from 'sequelize';

export class DesignComment extends Model {
    public id!: number;
    public id_design!: string;
    public comment!: string;
    public id_user!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initDesignCommentModel = (sequelize: Sequelize) => {
    DesignComment.init(
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
            comment: {
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
            modelName: 'DesignComment',
            tableName: 'design_comments',
            timestamps: true,
        }
    );
};
