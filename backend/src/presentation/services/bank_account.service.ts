import { Op } from "sequelize";
import { Bank, BankAccount, Supplier } from "../../database/mysql/models";
import { CustomError, BankAccountDto, BankAccountEntity, PaginationDto } from "../../domain";

export interface BankAccountFilters {
    name: string;
}
export class BankAccountService {

    public async getBankAccounts() {
        const bankAccounts = await BankAccount.findAll();
        const bankAccountsEntities = bankAccounts.map(item => BankAccountEntity.fromObject(item));
        return { items: bankAccountsEntities };
    }

    public async getBankAccountsBySupplier(id_supplier: number) {
        const supplier = await Supplier.findByPk(id_supplier, { attributes: ['id', 'name'] });
        if (!supplier) throw CustomError.notFound('Proveedor no encontrado');
        const bankAccounts = await BankAccount.findAll({ where: { id_supplier }, include: [{ model: Bank, as: 'bank' }] });
        const bankAccountsEntities = bankAccounts.map(item => BankAccountEntity.listableBankAccounts(item));
        return { items: bankAccountsEntities, supplier: supplier.name };
    }

    public async getBankAccount(id: number) {
        const bank = await BankAccount.findByPk(id);
        if (!bank) throw CustomError.notFound('Cuenta de banco no encontrada');
        const { ...bankEntity } = BankAccountEntity.fromObject(bank);
        return { bank: bankEntity };
    }

    public async createBankAccount(createBankAccountDto: BankAccountDto) {
        try {
            const bank = await BankAccount.create({
                ...createBankAccountDto,
            }); 
            const { ...bankEntity } = BankAccountEntity.fromObject(bank);
            return { bank: bankEntity, message: 'Cuenta de banco creada correctamente' };
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw CustomError.badRequest('La cuenta de banco que intenta crear ya existe');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async updateBankAccount(id: number, updateBankAccountDto: BankAccountDto) {
        const bank = await BankAccount.findByPk(id);
        if (!bank) throw CustomError.notFound('Cuenta de banco no encontrada');

        try {
            await bank.update(updateBankAccountDto);
            const { ...bankEntity } = BankAccountEntity.fromObject(bank);
            return { bank: bankEntity, message: 'Cuenta de banco actualizada correctamente' };
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw CustomError.badRequest('La cuenta de banco que intenta actualizar ya existe');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async deleteBankAccount(id: number) {
        const bank = await BankAccount.findByPk(id);
        if (!bank) throw CustomError.notFound('Cuenta de banco no encontrada');

        try {
            await bank.destroy();
            return { message: 'Cuenta de banco eliminada correctamente' };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

}