import { DataTypes, Model, Sequelize } from 'sequelize';

export class Member extends Model {
    public id!: number;
    public name!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initMemberModel = (sequelize: Sequelize) => {
    Member.init(
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
            modelName: 'Member',
            tableName: 'members',
            timestamps: true,
        }
    );
};
