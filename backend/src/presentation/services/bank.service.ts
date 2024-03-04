import { Op } from "sequelize";
import { Bank } from "../../database/mysql/models";
import { CustomError, NameDto, BankEntity, PaginationDto } from "../../domain";

export interface BankFilters {
    name: string;
}
export class BankService {

    public async getBanks() {
        const brands = await Bank.findAll();
        const brandsEntities = brands.map(brand => BankEntity.fromObject(brand));
        return { items: brandsEntities };
    }

    public async getBanksPaginated(paginationDto: PaginationDto, filters: BankFilters) {
        const { page, limit } = paginationDto;

        // FILTERS
        let where = {};
        if (filters.name) where = { ...where, name: { [Op.like]: `%${filters.name}%` } };

        const [brands, total] = await Promise.all([
            Bank.findAll({ where, offset: (page - 1) * limit, limit }),
            Bank.count({ where })
        ]);
        const brandsEntities = brands.map(brand => BankEntity.fromObject(brand));
        return { items: brandsEntities, total_items: total };
    }

    public async getBank(id: number) {
        const brand = await Bank.findByPk(id);
        if (!brand) throw CustomError.notFound('Banco no encontrado');
        const { ...brandEntity } = BankEntity.fromObject(brand);
        return { brand: brandEntity };
    }

    public async createBank(createNameDto: NameDto) {
        const brand = await Bank.findOne({ where: { name: createNameDto.name } });
        if (brand) throw CustomError.badRequest('El banco ya existe');

        try {
            const brand = await Bank.create({
                name: createNameDto.name
            });
            const { ...brandEntity } = BankEntity.fromObject(brand);
            return { brand: brandEntity, message: 'Banco creada correctamente' };
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw CustomError.badRequest('El banco que intenta crear ya existe');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async updateBank(id: number, updateNameDto: NameDto) {
        const brand = await Bank.findByPk(id);
        if (!brand) throw CustomError.notFound('Banco no encontrado');

        try {
            await brand.update(updateNameDto);
            const { ...brandEntity } = BankEntity.fromObject(brand);
            return { brand: brandEntity, message: 'Banco actualizada correctamente' };
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw CustomError.badRequest('El banco que intenta actualizar ya existe');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async deleteBank(id: number) {
        const brand = await Bank.findByPk(id);
        if (!brand) throw CustomError.notFound('Banco no encontrado');
        
        try {
            await brand.destroy();
            return { message: 'Banco eliminado correctamente' };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

}