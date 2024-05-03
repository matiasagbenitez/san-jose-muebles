import { DataTypes, Model, Sequelize } from 'sequelize';
import { VisitRequestAudit } from './VisitRequestAudit.model';

export class VisitRequest extends Model {
    public id!: number;
    public id_visit_reason!: number;
    public status!: 'PENDIENTE' | 'PAUSADA' | 'REALIZADA' | 'CANCELADA';
    public priority!: 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE';
    public id_client!: number;
    public id_locality!: number;
    public address!: string;

    public notes!: string;
    public schedule!: 'NOT_SCHEDULED' | 'PARTIAL_SCHEDULED' | 'FULL_SCHEDULED';
    public start!: Date;
    public end!: Date;

    public id_user!: number;

    public _previousDataValues: any;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initVisitRequestModel = (sequelize: Sequelize) => {
    VisitRequest.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            id_visit_reason: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM('PENDIENTE', 'PAUSADA', 'REALIZADA', 'CANCELADA'),
                allowNull: false,
            },
            priority: {
                type: DataTypes.ENUM('BAJA', 'MEDIA', 'ALTA', 'URGENTE'),
                allowNull: false,
            },
            id_client: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            id_locality: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            address: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            notes: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            schedule: {
                type: DataTypes.ENUM('NOT_SCHEDULED', 'PARTIAL_SCHEDULED', 'FULL_SCHEDULED'),
                allowNull: false,
            },
            start: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            end: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            id_user: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
        },
        {
            sequelize,
            paranoid: true,
            modelName: 'VisitRequest',
            tableName: 'visit_requests',
            timestamps: true,
        }
    );

    VisitRequest.afterCreate(async (record: VisitRequest, options: any) => {
        await VisitRequestAudit.create({
            action: 'CREATE',
            id_row: record.dataValues.id,
            before: null,
            after: record.toJSON(),
            id_user: options.id_user,
        }, { transaction: options.transaction });
    });

    VisitRequest.beforeUpdate(async (record: VisitRequest, options: any) => {
        const changedFields = record.changed();

        if (changedFields) {
            const auditData: any = {
                action: 'UPDATE',
                id_row: record.id,
                id_user: options.id_user,
                before: {},
                after: {}
            };

            changedFields.forEach((field: any) => {
                auditData.before[field] = record._previousDataValues[field];
                auditData.after[field] = record.getDataValue(field);
            });

            await VisitRequestAudit.create(auditData, { transaction: options.transaction });
        }
    });

    VisitRequest.beforeDestroy(async (record: VisitRequest, options: any) => {
        const dbRecord = await VisitRequest.findByPk(record.id, { raw: true });
        if (!dbRecord) return;

        await VisitRequestAudit.create({
            action: 'DELETE',
            id_row: record.id,
            before: dbRecord,
            after: null,
            id_user: options.id_user,
        }, { transaction: options.transaction });
    });


};
