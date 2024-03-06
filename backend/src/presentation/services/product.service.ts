import { Op, Sequelize } from "sequelize";
import { Product } from "../../database/mysql/models";
import { CustomError, ProductDto, ProductEntity, ProductListEntity, PaginationDto } from "../../domain";

export interface ProductFilters {
    text: string | undefined;
    id_brand: string | undefined;
    id_category: string | undefined;
    stock: string | undefined;
}

export class ProductService {

    public async getProducts() {
        const products = await Product.findAll({
            include: [
                { association: 'brand' },
                { association: 'category' },
                { association: 'currency' },
                { association: 'unit' }
            ],
        });
        const productsEntities = products.map(product => ProductEntity.fromObject(product));
        return { items: productsEntities };
    }

    public async getProductsPaginated(paginationDto: PaginationDto, filters: any) {
        const { page, limit } = paginationDto;

        // FILTERS
        let where = {};
        if (filters.text) where = {
            [Op.or]: [
                { name: { [Op.like]: `%${filters.text}%` } },
                { code: { [Op.like]: `%${filters.text}%` } },
            ]
        };
        if (filters.id_brand) where = { ...where, id_brand: filters.id_brand };
        if (filters.id_category) where = { ...where, id_category: filters.id_category };
        if (filters.stock === 'low') {
            where = { ...where, actual_stock: { [Op.lt]: Sequelize.col('min_stock') } };
        } else if (filters.stock === 'normal') {
            where = { ...where, actual_stock: { [Op.gte]: Sequelize.col('min_stock') } };
        } else if (filters.stock === 'high') {
            where = { ...where, actual_stock: { [Op.gte]: Sequelize.col('rep_stock') } };
        } else if (filters.stock === 'empty') {
            where = { ...where, actual_stock: 0 };
        }

        const [products, total] = await Promise.all([
            Product.findAll({
                where,
                include: [
                    { association: 'brand' },
                    { association: 'category' },
                    { association: 'currency' },
                    { association: 'unit' }
                ],
                offset: (page - 1) * limit,
                limit
            }),
            Product.count({ where })
        ]);
        const productsEntities = products.map(product => ProductListEntity.fromObject(product));
        return { items: productsEntities, total_items: total };
    }

    public async getProduct(id: number) {
        const product = await Product.findByPk(id, {
            include: [
                { association: 'brand' },
                { association: 'category' },
                { association: 'currency' },
                { association: 'unit' }
            ]
        });
        if (!product) throw CustomError.notFound('Producto no encontrado');
        const { ...productEntity } = ProductEntity.fromObject(product);
        return { product: productEntity };
    }

    public async createProduct(createProductDto: ProductDto) {

        try {
            const product = await Product.create({ ...createProductDto });
            return { id: product.id, message: 'Producto creado correctamente' };
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw CustomError.badRequest('El product que intenta crear ya existe');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async updateProduct(id: number, updateProductDto: ProductDto) {
        const product = await Product.findByPk(id);
        if (!product) throw CustomError.notFound('Producto no encontrado');
        try {
            await product.update(updateProductDto);
            return { message: 'Producto actualizado correctamente' };
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw CustomError.badRequest('El product que intenta actualizar ya existe');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async deleteProduct(id: number) {
        const product = await Product.findByPk(id);
        if (!product) throw CustomError.notFound('Producto no encontrado');

        try {
            await product.destroy();
            return { message: 'Producto eliminado correctamente' };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

}