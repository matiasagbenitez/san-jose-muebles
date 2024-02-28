import { DataTypes, Model, Sequelize } from 'sequelize';

export class PaymentMethod extends Model {
    public id!: number;
    public name!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initPaymentMethodModel = (sequelize: Sequelize) => {
    PaymentMethod.init(
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
            modelName: 'PaymentMethod',
            tableName: 'payment_methods',
            timestamps: true,
        }
    );
};
