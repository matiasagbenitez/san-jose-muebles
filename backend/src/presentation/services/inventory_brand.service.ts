import { Op } from "sequelize";
import { InventoryBrand } from "../../database/mysql/models";
import { CustomError, NameDto, BrandEntity, PaginationDto } from "../../domain";

export interface InventoryBrandFilters {
    name: string;
}
export class InventoryBrandService {

    public async getInventoryBrands() {
        const brands = await InventoryBrand.findAll({order: [['name', 'ASC']]});
        const brandsEntities = brands.map(brand => BrandEntity.fromObject(brand));
        return { items: brandsEntities };
    }

    public async getInventoryBrandsPaginated(paginationDto: PaginationDto, filters: InventoryBrandFilters) {
        const { page, limit } = paginationDto;

        // FILTERS
        let where = {};
        if (filters.name) where = { ...where, name: { [Op.like]: `%${filters.name}%` } };

        const [brands, total] = await Promise.all([
            InventoryBrand.findAll({ where, offset: (page - 1) * limit, limit }),
            InventoryBrand.count({ where })
        ]);
        const brandsEntities = brands.map(brand => BrandEntity.fromObject(brand));
        return { items: brandsEntities, total_items: total };
    }

    public async getInventoryBrand(id: number) {
        const brand = await InventoryBrand.findByPk(id);
        if (!brand) throw CustomError.notFound('Marca de herramienta no encontrada');
        const { ...brandEntity } = BrandEntity.fromObject(brand);
        return { brand: brandEntity };
    }

    public async createInventoryBrand(createNameDto: NameDto) {
        const brand = await InventoryBrand.findOne({ where: { name: createNameDto.name } });
        if (brand) throw CustomError.badRequest('La marca de la herramienta ya existe');

        try {
            const brand = await InventoryBrand.create({
                name: createNameDto.name
            });
            const { ...brandEntity } = BrandEntity.fromObject(brand);
            return { brand: brandEntity, message: 'Marca de herramienta creada correctamente' };
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw CustomError.badRequest('La marca de la herramienta que intenta crear ya existe');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async updateInventoryBrand(id: number, updateNameDto: NameDto) {
        const brand = await InventoryBrand.findByPk(id);
        if (!brand) throw CustomError.notFound('Marca de herramienta no encontrada');

        try {
            await brand.update(updateNameDto);
            const { ...brandEntity } = BrandEntity.fromObject(brand);
            return { brand: brandEntity, message: 'Marca de herramienta actualizada correctamente' };
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw CustomError.badRequest('La marca de la herramienta que intenta actualizar ya existe');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async deleteInventoryBrand(id: number) {
        const brand = await InventoryBrand.findByPk(id);
        if (!brand) throw CustomError.notFound('Marca de herramienta no encontrada');
        
        try {
            await brand.destroy();
            return { message: 'Marca de herramienta eliminada correctamente' };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

}