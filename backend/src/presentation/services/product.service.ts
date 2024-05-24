import { Op, Sequelize } from "sequelize";
import { Product, PurchaseItem } from "../../database/mysql/models";
import { CustomError, ProductDto, ProductEntity, ProductPendingReceptionEntity, ProductListEntity, PaginationDto, ProductInfoDto, ProductStockDto, ProductPriceDto, ProductEditableEntity, ProductSelectEntity, ProductSelect2Entity } from "../../domain";

export interface ProductFilters {
    text: string | undefined;
    id_brand: string | undefined;
    id_category: string | undefined;
    stock: string | undefined;
}

export class ProductService {

    public async getProductsSelect2() {
        const products = await Product.findAll({
            include: [
                { association: 'brand' }, { association: 'unit' }
            ],
        });
        const productsEntities = products.map(product => ProductSelect2Entity.fromObject(product));
        return { items: productsEntities };
    }

    public async getProducts() {
        const products = await Product.findAll({
            include: [
                { association: 'brand' },
            ],
        });
        const productsEntities = products.map(product => ProductSelectEntity.fromObject(product));
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
            where = { ...where, min_stock: { [Op.gte]: Sequelize.literal('inc_stock + actual_stock'), } };
        } else if (filters.stock === 'normal') {
            where = { ...where, actual_stock: { [Op.gte]: Sequelize.col('min_stock') } };
        } else if (filters.stock === 'incoming') {
            where = { ...where, inc_stock: { [Op.gt]: 0 } };
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
        const [product, pending_receptions] = await Promise.all([
            Product.findByPk(id, {
                include: [
                    { association: 'brand' },
                    { association: 'category' },
                    { association: 'currency' },
                    { association: 'unit' }
                ]
            }),
            await PurchaseItem.findAll({
                where: { id_product: id, fully_stocked: false },
                include: [
                    {
                        association: 'purchase',
                        attributes: ['id', 'date'],
                        where: { status: 'VALIDA' },
                        include: [
                            {
                                association: 'supplier',
                                attributes: ['id', 'name']
                            },
                        ]
                    }
                ]
            })
        ]);
        if (!product) throw CustomError.notFound('Producto no encontrado');
        const { ...productEntity } = ProductEntity.fromObject(product);
        const entities = pending_receptions.map((item) => ProductPendingReceptionEntity.fromObject(item));
        return { product: productEntity, pending_receptions: entities };
    }

    public async getProductEditable(id: number) {
        const product = await Product.findByPk(id);
        if (!product) throw CustomError.notFound('Producto no encontrado');
        const { ...productEntity } = ProductEditableEntity.fromObject(product);
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

    public async updateProduct(id: number, updateProductDto: ProductInfoDto | ProductStockDto | ProductPriceDto) {
        const product = await Product.findByPk(id);
        if (!product) throw CustomError.notFound('Producto no encontrado');
        try {
            await product.update({ ...updateProductDto });
            return { id: product.id, message: 'Producto actualizado correctamente' };
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw CustomError.badRequest('El producto que intenta actualizar ya existe');
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
        } catch (error: any) {
            const errorMessages: Record<string, string> = {
                SequelizeDatabaseError: 'Ocurrió un error de BASE DE DATOS al intentar eliminar el producto',
                SequelizeForeignKeyConstraintError: '¡No se puede eliminar el producto porque tiene registros asociados!',
            };

            const errorMessage = errorMessages[error.name] || 'Ocurrió un error desconocido al intentar eliminar el producto';
            throw CustomError.internalServerError(errorMessage);
        }
    }

}