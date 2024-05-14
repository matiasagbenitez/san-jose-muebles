import { Op } from "sequelize";
import { Supplier, SupplierAccount } from "../../database/mysql/models";
import { CustomError, PaginationDto, SupplierAccountDataEntity, SupplierAccountDto, SupplierAccountListEntity, SupplierAccountByCurrencyEntity, SupplierBasicEntity, SupplierOwnAccountsListEntity } from "../../domain";
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
        return { items, total_items: total };
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

    public async getAccountDataById(id: number) {
        try {
            const account = await SupplierAccount.findByPk(id, {
                include: [
                    { association: 'currency', attributes: ['name', 'symbol', 'is_monetary'] },
                    {
                        association: 'supplier', attributes: ['id', 'name'], include: [{
                            association: 'locality', attributes: ['name'],
                            include: [{ association: 'province', attributes: ['name'] }]
                        }]
                    }
                ]
            });
            if (!account) throw CustomError.notFound('Cuenta corriente no encontrada');
            const entity = SupplierAccountDataEntity.fromObject(account);

            return { item: entity };

        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async getAccountsBySupplier(id_supplier: number) {
        try {
            const [supplier, accounts] = await Promise.all([
                Supplier.findByPk(id_supplier, {
                    include: [{
                        association: 'locality', attributes: ['name'],
                        include: [{ association: 'province', attributes: ['name'] }]
                    }]
                }),
                SupplierAccount.findAll({
                    where: { id_supplier },
                    include: { association: 'currency', attributes: ['name', 'symbol', 'is_monetary'] },
                })
            ]);
            if (!supplier) throw CustomError.notFound('¡Proveedor no encontrado!');

            const entity = SupplierBasicEntity.fromObject(supplier);
            const entities = accounts.map(item => SupplierOwnAccountsListEntity.fromObject(item));

            return { supplier: entity, accounts: entities };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async getSuppliersAccountsByCurrency(id_currency: number) {
        try {
            const rows = await SupplierAccount.findAll({
                where: { id_currency },
                include: ['currency', 'supplier'],
                order: [['supplier', 'name', 'ASC']]
            });
            const entities = rows.map(item => SupplierAccountByCurrencyEntity.fromObject(item));
            return { items: entities };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async createAccount(createSupplierAccountDto: SupplierAccountDto) {
        try {
            await SupplierAccount.create({ ...createSupplierAccountDto });
            return { message: '¡Cuenta corriente creada correctamente!' };
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw CustomError.badRequest('¡El proveedor ya tiene una cuenta corriente en esa moneda!');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

}