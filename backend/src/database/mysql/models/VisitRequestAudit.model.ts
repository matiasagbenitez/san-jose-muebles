import { DataTypes, Model, Sequelize } from 'sequelize';

export class VisitRequestAudit extends Model {
    public id!: number;
    public action!: string;
    public recordId!: number;
    public before!: any;
    public after!: any;
    public userId!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initVisitRequestAuditModel = (sequelize: Sequelize) => {
    VisitRequestAudit.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            action: {
                type: DataTypes.ENUM('CREATE', 'UPDATE', 'DELETE'),
                allowNull: false,
            },
            id_row: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            before: {
                type: DataTypes.JSON,
                allowNull: true,
            },
            after: {
                type: DataTypes.JSON,
                allowNull: true,
            },
            id_user: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'VisitRequestAudit',
            tableName: 'visit_request_audits',
            timestamps: true,
        }
    );
};
