import { DataTypes, Model, Sequelize } from 'sequelize';

export class RelatedPerson extends Model {
    public id!: number;
    public id_project!: number;
    public name!: string;
    public phone!: string;
    public relation!: string;
    public annotations!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initRelatedPersonModel = (sequelize: Sequelize) => {
    RelatedPerson.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            id_project: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            phone: {
                type: DataTypes.STRING,
            },
            relation: {
                type: DataTypes.STRING,
            },
            annotations: {
                type: DataTypes.STRING,
            }
        },
        {
            sequelize,
            modelName: 'RelatedPerson',
            tableName: 'related_persons',
        }
    );
};
