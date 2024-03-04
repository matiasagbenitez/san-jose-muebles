import { Op } from "sequelize";
import { Bank } from "../../database/mysql/models";
import { CustomError, NameDto, BankEntity, PaginationDto } from "../../domain";

export interface BankFilters {
    name: string;
}
export class BankService {

    public async getBanks() {
        const banks = await Bank.findAll();
        const banksEntities = banks.map(bank => BankEntity.fromObject(bank));
        return { items: banksEntities };
    }

    public async getBanksPaginated(paginationDto: PaginationDto, filters: BankFilters) {
        const { page, limit } = paginationDto;

        // FILTERS
        let where = {};
        if (filters.name) where = { ...where, name: { [Op.like]: `%${filters.name}%` } };

        const [banks, total] = await Promise.all([
            Bank.findAll({ where, offset: (page - 1) * limit, limit }),
            Bank.count({ where })
        ]);
        const banksEntities = banks.map(bank => BankEntity.fromObject(bank));
        return { items: banksEntities, total_items: total };
    }

    public async getBank(id: number) {
        const bank = await Bank.findByPk(id);
        if (!bank) throw CustomError.notFound('Banco no encontrado');
        const { ...bankEntity } = BankEntity.fromObject(bank);
        return { bank: bankEntity };
    }

    public async createBank(createNameDto: NameDto) {
        const bank = await Bank.findOne({ where: { name: createNameDto.name } });
        if (bank) throw CustomError.badRequest('El banco ya existe');

        try {
            const bank = await Bank.create({
                name: createNameDto.name
            });
            const { ...bankEntity } = BankEntity.fromObject(bank);
            return { bank: bankEntity, message: 'Banco creado correctamente' };
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw CustomError.badRequest('El banco que intenta crear ya existe');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async updateBank(id: number, updateNameDto: NameDto) {
        const bank = await Bank.findByPk(id);
        if (!bank) throw CustomError.notFound('Banco no encontrado');

        try {
            await bank.update(updateNameDto);
            const { ...bankEntity } = BankEntity.fromObject(bank);
            return { bank: bankEntity, message: 'Banco actualizado correctamente' };
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw CustomError.badRequest('El banco que intenta actualizar ya existe');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async deleteBank(id: number) {
        const bank = await Bank.findByPk(id);
        if (!bank) throw CustomError.notFound('Banco no encontrado');
        
        try {
            await bank.destroy();
            return { message: 'Banco eliminado correctamente' };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

}