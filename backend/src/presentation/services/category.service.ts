import { Op } from "sequelize";
import { Category } from "../../database/mysql/models";
import { CustomError, NameDto, CategoryEntity, PaginationDto } from "../../domain";

export interface CategoryFilters {
    name: string;
}
export class CategoryService {

    public async getCategories() {
        const categories = await Category.findAll({order: [['name', 'ASC']]});
        const categoriesEntities = categories.map(category => CategoryEntity.fromObject(category));
        return { items: categoriesEntities };
    }

    public async getCategoriesPaginated(paginationDto: PaginationDto, filters: CategoryFilters) {
        const { page, limit } = paginationDto;

        // FILTERS
        let where = {};
        if (filters.name) where = { ...where, name: { [Op.like]: `%${filters.name}%` } };

        const [categories, total] = await Promise.all([
            Category.findAll({ where, offset: (page - 1) * limit, limit }),
            Category.count({ where })
        ]);
        const categoriesEntities = categories.map(category => CategoryEntity.fromObject(category));
        return { items: categoriesEntities, total_items: total };
    }

    public async getCategory(id: number) {
        const category = await Category.findByPk(id);
        if (!category) throw CustomError.notFound('Categoría no encontrada');
        const { ...categoryEntity } = CategoryEntity.fromObject(category);
        return { category: categoryEntity };
    }

    public async createCategory(createNameDto: NameDto) {
        const category = await Category.findOne({ where: { name: createNameDto.name } });
        if (category) throw CustomError.badRequest('La categoría ya existe');

        try {
            const category = await Category.create({
                name: createNameDto.name
            });
            const { ...categoryEntity } = CategoryEntity.fromObject(category);
            return { category: categoryEntity, message: 'Categoría creada correctamente' };
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw CustomError.badRequest('La categoría que intenta crear ya existe');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async updateCategory(id: number, updateNameDto: NameDto) {
        const category = await Category.findByPk(id);
        if (!category) throw CustomError.notFound('Categoría no encontrada');

        try {
            await category.update(updateNameDto);
            const { ...categoryEntity } = CategoryEntity.fromObject(category);
            return { category: categoryEntity, message: 'Categoría actualizada correctamente' };
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw CustomError.badRequest('La categoría que intenta actualizar ya existe');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async deleteCategory(id: number) {
        const category = await Category.findByPk(id);
        if (!category) throw CustomError.notFound('Categoría no encontrada');
        
        try {
            await category.destroy();
            return { message: 'Categoría eliminada correctamente' };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

}