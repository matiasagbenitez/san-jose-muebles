import { DataTypes, Model, Sequelize } from 'sequelize';

export class Brand extends Model {
    public id!: number;
    public name!: string;
    public code!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initBrandModel = (sequelize: Sequelize) => {
    Brand.init(
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
            modelName: 'Brand',
            tableName: 'brands',
            timestamps: true,
        }
    );
};
