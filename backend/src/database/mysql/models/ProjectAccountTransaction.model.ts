import { DataTypes, Model, Sequelize } from 'sequelize';

export class ProjectAccountTransaction extends Model {
    public id!: number;
    public id_project_account!: number;
    public type!: 'NEW_PAYMENT' | 'POS_ADJ' | 'NEG_ADJ' | 'NEW_SUPPLIER_PAYMENT' | 'DEL_SUPPLIER_PAYMENT';
    public description!: string;
    public received_amount!: number;
    public id_currency!: number;

    public prev_balance!: number;
    public equivalent_amount!: number;
    public post_balance!: number;
    public id_user!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date; 
}

export const initProjectAccountTransactionModel = (sequelize: Sequelize) => {
    ProjectAccountTransaction.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            id_project_account: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            type: {
                type: DataTypes.ENUM('NEW_PAYMENT', 'POS_ADJ', 'NEG_ADJ', 'NEW_SUPPLIER_PAYMENT', 'DEL_SUPPLIER_PAYMENT'),
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING(200),
            },
            received_amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
            },
            id_currency: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            prev_balance: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
            },
            equivalent_amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
            },
            post_balance: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
            },
            id_user: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'ProjectAccountTransaction',
            tableName: 'project_account_transactions',
            timestamps: true,
        }
    );
};
