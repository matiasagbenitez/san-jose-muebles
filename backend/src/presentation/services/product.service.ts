import { Op } from "sequelize";
import { Product } from "../../database/mysql/models";
import { CustomError, ProductDto, ProductEntity, ProductListEntity, PaginationDto } from "../../domain";

export interface ProductFilters {
    name: string;
    id_brand: number | string;
    id_category: number | string;
    normal_stock: boolean;
    low_stock: boolean;
}

export class ProductService {

    public async getProducts() {
        const products = await Product.findAll();
        const productsEntities = products.map(product => ProductEntity.fromObject(product));
        return { items: productsEntities };
    }

    public async getProductsPaginated(paginationDto: PaginationDto, filters: ProductFilters) {
        const { page, limit } = paginationDto;

        // FILTERS
        let where = {};
        if (filters.name) where = {
            [Op.or]: [
                { name: { [Op.like]: `%${filters.name}%` } },
                { code: { [Op.like]: `%${filters.name}%` } },
            ]
        };

        const [products, total] = await Promise.all([
            Product.findAll({
                where,
                include: [
                    { association: 'brand' },
                    { association: 'category' },
                    { association: 'currency' },
                ],
                offset: (page - 1) * limit, limit
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
            ]
        });
        if (!product) throw CustomError.notFound('Producto no encontrado');
        const { ...productEntity } = ProductListEntity.fromObject(product);
        return { product: productEntity };
    }

    public async createProduct(createProductDto: ProductDto) {

        try {
            await Product.create({ ...createProductDto });
            return { message: 'Producto creado correctamente' };
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