import { DataTypes, Model, Sequelize } from 'sequelize';

export class Category extends Model {
    public id!: number;
    public name!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initCategoryModel = (sequelize: Sequelize) => {
    Category.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
        },
        {
            sequelize,
            modelName: 'Category',
            tableName: 'categories',
            timestamps: true,
        }
    );
};
