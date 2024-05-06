import { DataTypes, Model, Sequelize } from 'sequelize';

export class GroupMember extends Model {
    public id!: number;
    public id_group!: number;
    public id_member!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initGroupMemberModel = (sequelize: Sequelize) => {
    GroupMember.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            id_group: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            id_member: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'GroupMember',
            tableName: 'group_members',
            timestamps: true,
        }
    );
};
