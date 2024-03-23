import { SupplierAccount } from "../../database/mysql/models";
import { CustomError, SupplierAccountDto, SupplierAccountEntity } from "../../domain";
import { SupplierService } from "./supplier.service";

export class SupplierAccountService {

    public async getAccountsBySupplier(id_supplier: number) {
        const supplierService = new SupplierService();
        const supplier = await supplierService.getSupplierData(id_supplier);
        if (!supplier) throw CustomError.notFound('Proveedor no encontrado');

        const rows = await SupplierAccount.findAll({ where: { id_supplier }, include: 'currency' });
        const entities = rows.map(item => SupplierAccountEntity.fromObject(item));
        return { supplier: supplier.name, accounts: entities };
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