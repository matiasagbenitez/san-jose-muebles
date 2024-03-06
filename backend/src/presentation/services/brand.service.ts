import { Op } from "sequelize";
import { Brand } from "../../database/mysql/models";
import { CustomError, NameDto, BrandEntity, PaginationDto } from "../../domain";

export interface BrandFilters {
    name: string;
}
export class BrandService {

    public async getBrands() {
        const brands = await Brand.findAll({order: [['name', 'ASC']]});
        const brandsEntities = brands.map(brand => BrandEntity.fromObject(brand));
        return { items: brandsEntities };
    }

    public async getBrandsPaginated(paginationDto: PaginationDto, filters: BrandFilters) {
        const { page, limit } = paginationDto;

        // FILTERS
        let where = {};
        if (filters.name) where = { ...where, name: { [Op.like]: `%${filters.name}%` } };

        const [brands, total] = await Promise.all([
            Brand.findAll({ where, offset: (page - 1) * limit, limit }),
            Brand.count({ where })
        ]);
        const brandsEntities = brands.map(brand => BrandEntity.fromObject(brand));
        return { items: brandsEntities, total_items: total };
    }

    public async getBrand(id: number) {
        const brand = await Brand.findByPk(id);
        if (!brand) throw CustomError.notFound('Marca no encontrada');
        const { ...brandEntity } = BrandEntity.fromObject(brand);
        return { brand: brandEntity };
    }

    public async createBrand(createNameDto: NameDto) {
        const brand = await Brand.findOne({ where: { name: createNameDto.name } });
        if (brand) throw CustomError.badRequest('La marca ya existe');

        try {
            const brand = await Brand.create({
                name: createNameDto.name
            });
            const { ...brandEntity } = BrandEntity.fromObject(brand);
            return { brand: brandEntity, message: 'Marca creada correctamente' };
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw CustomError.badRequest('La marca que intenta crear ya existe');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async updateBrand(id: number, updateNameDto: NameDto) {
        const brand = await Brand.findByPk(id);
        if (!brand) throw CustomError.notFound('Marca no encontrada');

        try {
            await brand.update(updateNameDto);
            const { ...brandEntity } = BrandEntity.fromObject(brand);
            return { brand: brandEntity, message: 'Marca actualizada correctamente' };
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw CustomError.badRequest('La marca que intenta actualizar ya existe');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async deleteBrand(id: number) {
        const brand = await Brand.findByPk(id);
        if (!brand) throw CustomError.notFound('Marca no encontrada');
        
        try {
            await brand.destroy();
            return { message: 'Marca eliminada correctamente' };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

}