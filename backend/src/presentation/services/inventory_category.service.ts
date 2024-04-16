import { Op } from "sequelize";
import { InventoryCategory } from "../../database/mysql/models";
import { CustomError, NameDto, CategoryEntity, PaginationDto } from "../../domain";

export interface InventoryCategoryFilters {
    name: string;
}
export class InventoryCategoryService {

    public async getInventoryCategories() {
        const categories = await InventoryCategory.findAll({order: [['name', 'ASC']]});
        const categoriesEntities = categories.map(category => CategoryEntity.fromObject(category));
        return { items: categoriesEntities };
    }

    public async getInventoryCategoriesPaginated(paginationDto: PaginationDto, filters: InventoryCategoryFilters) {
        const { page, limit } = paginationDto;

        // FILTERS
        let where = {};
        if (filters.name) where = { ...where, name: { [Op.like]: `%${filters.name}%` } };

        const [categories, total] = await Promise.all([
            InventoryCategory.findAll({ where, offset: (page - 1) * limit, limit }),
            InventoryCategory.count({ where })
        ]);
        const categoriesEntities = categories.map(category => CategoryEntity.fromObject(category));
        return { items: categoriesEntities, total_items: total };
    }

    public async getInventoryCategory(id: number) {
        const category = await InventoryCategory.findByPk(id);
        if (!category) throw CustomError.notFound('Categoría de herramienta no encontrada');
        const { ...categoryEntity } = CategoryEntity.fromObject(category);
        return { category: categoryEntity };
    }

    public async createInventoryCategory(createNameDto: NameDto) {
        const category = await InventoryCategory.findOne({ where: { name: createNameDto.name } });
        if (category) throw CustomError.badRequest('La categoría de la herramienta ya existe');

        try {
            const category = await InventoryCategory.create({
                name: createNameDto.name
            });
            const { ...categoryEntity } = CategoryEntity.fromObject(category);
            return { category: categoryEntity, message: 'Categoría de herramienta creada correctamente' };
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw CustomError.badRequest('La categoría de la herramienta que intenta crear ya existe');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async updateInventoryCategory(id: number, updateNameDto: NameDto) {
        const category = await InventoryCategory.findByPk(id);
        if (!category) throw CustomError.notFound('Categoría de herramienta no encontrada');

        try {
            await category.update(updateNameDto);
            const { ...categoryEntity } = CategoryEntity.fromObject(category);
            return { category: categoryEntity, message: 'Categoría de herramienta actualizada correctamente' };
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw CustomError.badRequest('La categoría de la herramienta que intenta actualizar ya existe');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async deleteInventoryCategory(id: number) {
        const category = await InventoryCategory.findByPk(id);
        if (!category) throw CustomError.notFound('Categoría de herramienta no encontrada');
        
        try {
            await category.destroy();
            return { message: 'Categoría de herramienta eliminada correctamente' };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

}