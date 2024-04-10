import { SupplierAccount, SupplierAccountTransaction } from "../../database/mysql/models";
import { CustomError, SupplierAccountDto, SupplierAccountEntity } from "../../domain";
import { SupplierService } from "./supplier.service";
import { SupplierAccountTransactionService } from "./supplier_account_transaction.service";

export class SupplierAccountService {

    public async getAccountTransactionsById(id: number) {
        try {
            const account = await SupplierAccount.findByPk(id, {
                include: [
                    { association: 'currency', attributes: ['name', 'symbol', 'is_monetary'] },
                    { association: 'supplier', attributes: ['name'] }
                ],
                attributes: { exclude: ['id_currency', 'createdAt', 'updatedAt'] }
            });
            if (!account) throw CustomError.notFound('Cuenta corriente no encontrada');

            // const transactions = await SupplierAccount.findByPk(id, {
            //     include: [
            //         {
            //             association: 'transactions',
            //             include: [
            //                 {
            //                     association: 'user',
            //                     attributes: ['name'],
            //                 },
            //                 {
            //                     association: 'purchase_transaction',
            //                     attributes: ['id_purchase'],
            //                 },  
            //             ],
            //             order: [['createdAt', 'ASC']],
            //         }
            //     ],
            // });

            const transactions = await SupplierAccountTransaction.findAll({
                where: { id_supplier_account: id },
                include: [
                    {
                        association: 'user',
                        attributes: ['name'],
                    },
                    {
                        association: 'purchase_transaction',
                        attributes: ['id_purchase'],
                    },
                ],
                order: [['createdAt', 'DESC']],
            });

            // console.log(transactions);

            return { account, transactions };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async getAccountsBySupplier(id_supplier: number) {
        try {
            const supplierService = new SupplierService();
            const supplier = await supplierService.getSupplierData(id_supplier);
            if (!supplier) throw CustomError.notFound('Proveedor no encontrado');

            const rows = await SupplierAccount.findAll({ where: { id_supplier }, include: 'currency' });
            const entities = rows.map(item => SupplierAccountEntity.fromObject(item));
            return { supplier: supplier.name, accounts: entities };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async createAccount(createSupplierAccountDto: SupplierAccountDto) {
        try {
            const item = await SupplierAccount.create({ ...createSupplierAccountDto });
            const rec = await SupplierAccount.findByPk(item.id, { include: 'currency' });
            if (!rec) throw CustomError.internalServerError('¡Error al crear la cuenta corriente!');
            const { ...account } = SupplierAccountEntity.fromObject(rec);
            return { account: account, message: '¡Cuenta corriente creada correctamente!' };
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw CustomError.badRequest('¡El proveedor ya tiene una cuenta corriente en esa moneda!');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async existsAccount(id_supplier: number, id_currency: number) {
        const item = await SupplierAccount.findOne({ where: { id_supplier, id_currency } });
        return item ? true : false;
    }

    public async findOrCreateAccount(id_supplier: number, id_currency: number): Promise<SupplierAccount> {

        const account = await SupplierAccount.findOrCreate({
            where: { id_supplier, id_currency },
            defaults: { id_supplier, id_currency, balance: 0 }
        });

        if (!account) throw CustomError.internalServerError('¡Error al buscar o crear la cuenta corriente!');
        return account[0];
    }

}