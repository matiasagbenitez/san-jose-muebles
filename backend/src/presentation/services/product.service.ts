import { Op, Sequelize } from "sequelize";
import { Product, PurchaseItem } from "../../database/mysql/models";
import { CustomError, ProductDto, ProductEntity, ProductPendingReceptionEntity, ProductListEntity, PaginationDto, ProductInfoDto, ProductStockDto, ProductPriceDto, ProductEditableEntity, ProductSelectEntity, AdjustProductStockDto, StockAdjustDto } from "../../domain";
import { PurchaseItemService } from "./purchase_item.service";
import { StockAdjustService } from "./stock_adjust.service";
import { mysqlSingleton } from "../../database";

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

    public async getProductPendingReceptions(id: number) {
        try {
            const purchaseItemService = new PurchaseItemService();
            const items = await purchaseItemService.getPendingReceptionsByProductId(id);
            const pendingReceptions = items.map((item: any) => ProductPendingReceptionEntity.fromObject(item));
            return { items: pendingReceptions };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async adjustProductStock(id_product: number, dto: AdjustProductStockDto, id_user: number) {
        const { op, quantity, comment } = dto;
        const product = await Product.findByPk(id_product);
        if (!product) throw CustomError.notFound('Producto no encontrado');

        const actual_stock = Number(product.actual_stock);

        if (op === 'sub' && actual_stock < quantity) {
            throw CustomError.badRequest('No hay suficiente stock para realizar la operación');
        }

        const stockAdjustService = new StockAdjustService();
        const [error, adjustDto] = StockAdjustDto.create({
            id_product,
            actual_stock,
            op,
            quantity,
            id_user,
            comment
        });
        if (error) throw CustomError.badRequest(error);

        const sequelize = mysqlSingleton.sequelize;
        if (!sequelize) throw CustomError.internalServerError('No se pudo establecer conexión con la base de datos');
        const t = await sequelize.transaction();

        try {
            let new_stock = op === 'add' ? actual_stock + quantity : actual_stock - quantity;
            await Product.update({
                actual_stock: new_stock,
            }, {
                where: { id: id_product },
                transaction: t
            });

            await stockAdjustService.createStockAdjust(adjustDto!, t);

            await t.commit();

            return { new_stock, message: '¡Stock ajustado correctamente!' };
        } catch (error) {
            await t.rollback();
            throw CustomError.internalServerError('Error al ajustar el stock');
        }
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
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    // ACTUALIZAR PRODUCTO POR COMPRA REGISTRADA
    public async updateProductByPurchase(id: number, id_currency: number, quantity: number, last_price: number): Promise<void> {
        try {
            await Product.update({
                inc_stock: Sequelize.literal(`inc_stock + ${quantity}`),
                last_price,
                id_currency,
            }, { where: { id } });
        } catch (error: any) {
            throw CustomError.internalServerError(`${error}`);
        }
    }


    // ACTUALIZAR STOCK POR RECEPCIÓN DEL PRODUCTO COMPRADO
    public async updateStockByReception(id: number, received: number): Promise<void> {
        try {
            await Product.update({
                inc_stock: Sequelize.literal(`inc_stock - ${received}`),
                actual_stock: Sequelize.literal(`actual_stock + ${received}`),
            }, { where: { id } });
        } catch (error: any) {
            throw CustomError.internalServerError(`${error}`);
        }
    }


    public async decreaseIncomingStock(id: number, quantity: number): Promise<void> {
        try {
            await Product.decrement('inc_stock', { by: quantity, where: { id } });
        } catch (error: any) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async decreaseIncomingStockInBulk(updates: { id_product: number; quantity: number }[]): Promise<void> {
        try {
            // Obtener los valores actuales de inc_stock para cada producto
            const currentStocks = await Promise.all(
                updates.map(async (update) => {
                    const product = await Product.findByPk(update.id_product);
                    if (!product) throw CustomError.notFound('Producto no encontrado');
                    return { id: product.id, currentStock: product.inc_stock };
                })
            );

            // Realizar la actualización en bloque
            await Promise.all(
                currentStocks.map(async ({ id, currentStock }) => {
                    const update = updates.find((update) => update.id_product === id);
                    const quantity = update ? update.quantity : 0; // Si update es undefined, asigna 0 a quantity
                    const newStock = currentStock - quantity;
                    await Product.update({ inc_stock: newStock }, { where: { id } });
                })
            );
        } catch (error: any) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

}