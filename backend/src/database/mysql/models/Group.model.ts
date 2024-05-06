import { DataTypes, Model, Sequelize } from 'sequelize';

export class Group extends Model {
    public id!: number;
    public name!: string;
    public status!: 'ACTIVO' | 'INACTIVO';

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initGroupModel = (sequelize: Sequelize) => {
    Group.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM('ACTIVO', 'INACTIVO'),
                allowNull: false,
                defaultValue: 'ACTIVO',
            },
        },
        {
            sequelize,
            modelName: 'Group',
            tableName: 'groups',
            timestamps: true,
        }
    );
};
