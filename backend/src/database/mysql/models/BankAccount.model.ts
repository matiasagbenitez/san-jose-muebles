import { DataTypes, Model, Sequelize } from 'sequelize';

export class BankAccount extends Model {
    public id!: number;
    public id_supplier!: number;
    public id_bank!: number;
    public account_owner!: string;
    public cbu_cvu!: string;
    public alias!: string;
    public account_number!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initBankAccountModel = (sequelize: Sequelize) => {
    BankAccount.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            id_supplier: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            id_bank: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            account_owner: {
                type: DataTypes.STRING(100),
            },
            cbu_cvu: {
                type: DataTypes.STRING(100), 
            },
            alias: {
                type: DataTypes.STRING(100),
            },
            account_number: {
                type: DataTypes.STRING(100),
            },
        },
        {
            sequelize,
            modelName: 'BankAccount',
            tableName: 'bank_accounts',
            timestamps: true,
        }
    );
};
