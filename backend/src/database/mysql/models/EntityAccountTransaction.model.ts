import { DataTypes, Model, Sequelize } from 'sequelize';

export class EntityAccountTransaction extends Model {
    public id!: number;
    public id_entity_account!: number;
    public type!: 'PAYMENT' | 'DEBT' | 'POS_ADJ' | 'NEG_ADJ';
    public description!: string;
    public prev_balance!: number;
    public amount!: number;
    public post_balance!: number;
    public id_user!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initEntityAccountTransactionModel = (sequelize: Sequelize) => {
    EntityAccountTransaction.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            id_entity_account: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            type: {
                type: DataTypes.ENUM('PAYMENT', 'DEBT', 'POS_ADJ', 'NEG_ADJ'),
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING(200),
            },
            prev_balance: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
            },
            amount: {
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
            modelName: 'EntityAccountTransaction',
            tableName: 'entity_account_transactions',
            timestamps: true,
        }
    );
};
