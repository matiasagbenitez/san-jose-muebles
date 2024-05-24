import { Op } from "sequelize";
import { StockLot, StockAdjust, Product } from "../../database/mysql/models";
import { CustomError, PaginationDto, CreateStockLotDTO, StockLotListEntity, StockLotItemEntity } from "../../domain";
export class StockLotService {

    public async getStockLots(paginationDto: PaginationDto, filters: any) {
        const { page, limit } = paginationDto;

        // FILTERS
        let where = {};
        if (filters.description) where = { ...where, description: { [Op.like]: `%${filters.description}%` } };
        if (filters.type && ['INCREMENT', 'DECREMENT'].includes(filters.type)) where = { ...where, type: filters.type };

        const [rows, total] = await Promise.all([
            StockLot.findAll({
                where,
                include: [{
                    association: 'user',
                    attributes: ['name']
                }],
                offset: (page - 1) * limit,
                limit,
                order: [['createdAt', 'DESC']]
            }),
            StockLot.count({ where })
        ]);
        const entities = rows.map(row => StockLotListEntity.fromObject(row));
        return { items: entities, total_items: total };

    }

    public async getLotBasic(id: number) {

        const row = await StockLot.findByPk(id, {
            include: [{
                association: 'user',
                attributes: ['name']
            }],
        });
        if (!row) throw CustomError.notFound('No se encontró el lote de stock');
        const entity = StockLotListEntity.fromObject(row);

        return { item: entity };
    }

    public async getStockLot(id_stock_lot: number, paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;

        const [rows, total] = await Promise.all([
            StockAdjust.findAll({
                where: { id_stock_lot },
                include: [{ association: 'product', attributes: ['name'] }],
                offset: (page - 1) * limit,
                limit,
            }),
            StockAdjust.count({ where: { id_stock_lot } })
        ]);
        const entities = rows.map(row => StockLotItemEntity.fromObject(row));

        return { items: entities, total_items: total };
    }

    public async createStockLot(dto: CreateStockLotDTO) {
        const transaction = await StockLot.sequelize!.transaction();
        if (!transaction) throw CustomError.internalServerError('No se pudo iniciar la transacción');

        try {
            const stock_lot = await StockLot.create({
                type: dto.type,
                description: dto.description,
                total_items: dto.total_items,
                id_user: dto.id_user,
            }, { transaction, returning: true });
            if (!stock_lot) throw CustomError.internalServerError('No se pudo crear el ajuste de stock');

            const list = [];
            const isDecrement = dto.type === 'DECREMENT';

            for (const item of dto.stock_list) {
                // Verificar que el producto exista
                const product = await Product.findByPk(item.id_product, { attributes: ['id', 'actual_stock'], transaction });
                if (!product) throw CustomError.badRequest(`No existe el producto con ID ${item.id_product}`);

                const prev_stock = Number(product.actual_stock);
                const new_quantity = Number(item.quantity);
                const post_stock = isDecrement ? prev_stock - new_quantity : prev_stock + new_quantity;

                // Verificar que haya suficiente stock en caso de DECREMENT
                if (isDecrement && prev_stock < new_quantity) {
                    throw CustomError.badRequest(`No hay suficiente stock del producto con ID ${item.id_product}`);
                }

                // Actualizar el stock del producto
                product.actual_stock = post_stock;
                await product.save({ transaction });

                // Crear el registro de ajuste
                list.push({
                    id_stock_lot: stock_lot.id,
                    id_product: item.id_product,
                    prev_stock: prev_stock,
                    quantity: dto.type === 'INCREMENT' ? new_quantity : -new_quantity,
                    post_stock: post_stock,
                });
            }

            // Crear los registros de ajuste
            await StockAdjust.bulkCreate(list, { transaction });

            await transaction.commit();

            return { id: stock_lot.id, message: '¡Lote creado con éxito!' };
        } catch (error) {
            await transaction.rollback();
            throw CustomError.internalServerError(`${error}`);
        }
    }

}