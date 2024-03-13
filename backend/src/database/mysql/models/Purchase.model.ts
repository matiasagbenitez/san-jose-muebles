import { DataTypes, Model, Sequelize } from 'sequelize';

export class Purchase extends Model {
    public id!: number;
    public created_by!: number;
    public id_supplier!: number;
    public date!: Date;
    public id_currency!: number;
    public subtotal!: number;
    public discount!: number;
    public total!: number;
    public paid_amount!: number;
    public credit_balance!: number;
    public payed_off!: boolean;
    public fully_stocked!: boolean;
    public nullified!: boolean;
    public nullified_by!: number;
    public nullified_date!: Date;
    public nullified_reason!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initPurchaseModel = (sequelize: Sequelize) => {
    Purchase.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            created_by: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            id_supplier: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            id_currency: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            subtotal: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            discount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            }, 
            shipping: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            fees: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            total: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            paid_amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            credit_balance: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            payed_off: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
            fully_stocked: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
            nullified: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
            nullified_by: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            nullified_date: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            nullified_reason: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'Purchase',
            tableName: 'purchases',
            timestamps: true,
        }
    );
};
