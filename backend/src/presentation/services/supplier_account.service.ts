import { Op } from "sequelize";
import { SupplierAccount } from "../../database/mysql/models";
import { CustomError, PaginationDto, SupplierAccountDataEntity, SupplierAccountDto, SupplierAccountEntity, SupplierAccountListEntity } from "../../domain";
import { SupplierService } from "./supplier.service";

export class SupplierAccountService {

    public async getSuppliersAccountsPaginated(paginationDto: PaginationDto, filters: any) {
        const { page, limit } = paginationDto;

        // FILTERS
        let where = {};
        if (filters.balance) {
            if (filters.balance === 'positive') where = { ...where, balance: { [Op.gt]: 0 } };
            if (filters.balance === 'negative') where = { ...where, balance: { [Op.lt]: 0 } };
            if (filters.balance === 'zero') where = { ...where, balance: 0 };
        }
        if (filters.id_currency) where = { ...where, id_currency: filters.id_currency };
        if (filters.id_supplier) where = { ...where, id_supplier: filters.id_supplier };

        const [suppliersAccounts, total] = await Promise.all([
            SupplierAccount.findAll({
                where,
                include: [
                    { association: 'currency', attributes: ['name', 'symbol', 'is_monetary'] },
                    { association: 'supplier', attributes: ['name'] }
                ],
                order: [['updatedAt', 'DESC']],
                limit,
                offset: (page - 1) * limit,
            }),
            SupplierAccount.count({ where })
        ]);

        const items = suppliersAccounts.map(item => SupplierAccountListEntity.fromObject(item));
        return { items, total_items: total};
    }


    public async getSupplierAccountById(id: number) {
        try {
            const account = await SupplierAccount.findByPk(id);
            if (!account) throw CustomError.notFound('Cuenta corriente no encontrada');
            return account;
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async updateSupplierAccountBalance(id: number, balance: number) {
        try {
            const account = await this.getSupplierAccountById(id);
            if (!account) throw CustomError.notFound('Cuenta corriente no encontrada');

            const updated = await account.update({ balance: balance });
            if (!updated) throw CustomError.internalServerError('¡Error al actualizar el saldo de la cuenta corriente!');

            return { account: updated, message: '¡Saldo actualizado correctamente!' };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async getAccountDataById(id: number) {
        try {
            const account = await SupplierAccount.findByPk(id, {
                include: [
                    { association: 'currency', attributes: ['name', 'symbol', 'is_monetary'] },
                    { association: 'supplier', attributes: ['name'] }
                ]
            });
            if (!account) throw CustomError.notFound('Cuenta corriente no encontrada');

            const item = SupplierAccountDataEntity.fromObject(account);
            return { account: item };

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

}