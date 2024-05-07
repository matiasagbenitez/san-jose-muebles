import { Op, Sequelize, Transaction } from "sequelize";
import { Product, Purchase, PurchaseItem, PurchaseNullation, PurchaseTransaction, SupplierAccount, SupplierAccountTransaction, User } from "../../database/mysql/models";
import { CustomError, CreatePurchaseDTO, PaginationDto, ListablePurchaseEntity, DetailPurchaseEntity, UpdateItemStockDto, ReceptionPartialDto, ReceptionTotalDto, PartialReceptionEntity, TotalReceptionEntity, SupplierAccountDto } from "../../domain";
import { PurchaseItemService } from "./purchase_item.service";
import { ReceptionPartialService } from "./reception_partial.service";
import { ReceptionTotalService } from "./reception_total.service.service";
import { SupplierAccountService } from "./supplier_account.service";
import { SupplierAccountTransactionService } from "./supplier_account_transaction.service";
import { PurchaseTransactionService } from "./purchase_transaction.service";

export interface PurchaseFilters {
    id_supplier: string | undefined;
    from_date: Date | undefined;
    to_date: Date | undefined;
    stock: string | undefined;
    status: 'ALL' | 'VALIDA' | 'ANULADA' | undefined;
}

export class PurchaseService {

    public async getPurchases() {
        const purchases = await Purchase.findAll({ include: ['supplier', 'currency'] });
        const listable = purchases.map(item => ListablePurchaseEntity.fromObject(item));
        return { items: listable };
    }

    public async getPurchasesPaginated(paginationDto: PaginationDto, filters: PurchaseFilters) {
        const { page, limit } = paginationDto;

        // FILTERS
        let where = {};
        if (filters.id_supplier) where = { ...where, id_supplier: filters.id_supplier };

        if (filters.from_date && filters.to_date) {
            where = { ...where, date: { [Op.between]: [filters.from_date, filters.to_date] } }
        } else if (filters.from_date) {
            where = { ...where, date: { [Op.gte]: filters.from_date } }
        } else if (filters.to_date) {
            where = { ...where, date: { [Op.lte]: filters.to_date } }
        }


        if (filters.stock === 'fully_stocked') {
            where = { ...where, fully_stocked: true };
        } else if (filters.stock === 'not_fully_stocked') {
            where = { ...where, fully_stocked: false };
        }

        switch (filters.status) {
            case 'VALIDA':
                where = { ...where, status: 'VALIDA' };
                break;
            case 'ANULADA':
                where = { ...where, status: 'ANULADA' };
                break;
            case 'ALL':
                break;
            default:
                where = { ...where, status: 'VALIDA' };
                break;
        }

        const [purchases, total] = await Promise.all([
            Purchase.findAll({
                where,
                include: ['supplier', 'currency', 'nullation'],
                offset: (page - 1) * limit,
                limit,
                order: [['date', 'DESC'], ['createdAt', 'DESC']],
            }),
            Purchase.count({ where }),
        ]);
        const listable = purchases.map(item => ListablePurchaseEntity.fromObject(item));
        return { items: listable, total_items: total };
    }

    public async getPurchase(id: number) {
        const purchase = await Purchase.findByPk(id, {
            include: [{
                association: 'items',
                attributes: ['id', 'quantity', 'price', 'subtotal', 'actual_stocked', 'fully_stocked'],
                include: [{
                    association: 'product',
                    attributes: ['code', 'name'],
                    include: [{
                        association: 'brand',
                        attributes: ['name']
                    }, {
                        association: 'unit',
                        attributes: ['name', 'symbol']
                    }]
                },]
            }, {
                association: 'currency',
                attributes: ['name', 'symbol', 'is_monetary']
            }, {
                association: 'supplier',
                attributes: ['id', 'name'],
                include: [{
                    association: 'locality',
                    attributes: ['name'],
                    include: [{
                        association: 'province',
                        attributes: ['name']
                    }]
                }]
            }, {
                association: 'user',
                attributes: ['name']
            }, {
                association: 'nullation',
                include: [{
                    association: 'user',
                    attributes: ['name']
                }]
            }],
        });
        if (!purchase) throw CustomError.notFound('Compra no encontrada');

        const supplierAccountService = new SupplierAccountService();
        const supplierAccount = await supplierAccountService.findAccount(purchase.id_supplier, purchase.id_currency);
        if (!supplierAccount) throw CustomError.notFound('Cuenta corriente no encontrada');

        const { ...entity } = DetailPurchaseEntity.fromObject(purchase);
        return { purchase: entity, account: supplierAccount.id };
    }

    public async getPurchasesBySupplierId(paginationDto: PaginationDto, id_supplier: number) {
        const { page, limit } = paginationDto;

        const purchases = await Purchase.findAndCountAll({
            where: { id_supplier },
            include: ['supplier', 'currency', 'nullation'],
            offset: (page - 1) * limit,
            limit,
            order: [['date', 'DESC'], ['createdAt', 'DESC']],
        });

        const items = purchases.rows.map(item => ListablePurchaseEntity.fromObject(item));
        return { items, total_items: purchases.count }
    }

    public async createPurchase(form: CreatePurchaseDTO, id_user: number) {

        const transaction: Transaction = await Purchase.sequelize!.transaction();

        try {
            const { products_list, ...rest } = form;

            //* 1) OBTENER O CREAR CUENTA CORRIENTE DEL PROVEEDOR EN LA MONEDA DE LA COMPRA
            const { id_supplier, id_currency } = rest;
            const [supplier_account, _] = await SupplierAccount.findOrCreate({
                where: { id_supplier, id_currency },
                defaults: { id_supplier, id_currency, balance: 0 },
                transaction,
            });
            if (!supplier_account) throw CustomError.internalServerError('¡Error al buscar o crear la cuenta corriente!')

            //* 2) CREAR LA COMPRA
            const purchase = await Purchase.create({
                ...rest,
                id_user,
            }, { transaction });

            //* 3) ASOCIAR PRODUCTOS A LA COMPRA
            const itemsToCreate = products_list.map((item) => ({
                id_purchase: purchase.id,
                ...item,
                actual_stocked: 0,
                fully_stocked: false,
            }));
            const itemsCreated = await PurchaseItem.bulkCreate(itemsToCreate, { transaction });

            //* 4) ACTUALIZAR EL INC_STOCK DE LOS PRODUCTOS, LA MONEDA Y EL PRECIO
            for (const item of itemsCreated) {
                try {
                    await Product.update({
                        inc_stock: Sequelize.literal(`inc_stock + ${item.quantity}`),
                        last_price: item.price,
                        id_currency: id_currency,
                    }, { where: { id: item.id_product }, transaction });
                } catch (error) {
                    throw CustomError.internalServerError('Ocurrió un error al actualizar los productos');
                }
            }

            //* 5) CALCULAR BALANCES
            const prev_balance: number = Number(supplier_account.balance);
            const post_balance: number = Number(supplier_account.balance) - Number(purchase.total);

            //* 6) REGISTRAR TRANSACCIÓN A CUENTA DEL PROVEEDOR
            const supplierAccountTransactionService = new SupplierAccountTransactionService();
            const { transaction: account_transaction } = await supplierAccountTransactionService.createTransactionNewPurchase({
                id_supplier_account: supplier_account.id,
                id_purchase: purchase.id,
                prev_balance,
                amount: purchase.total,
                post_balance,
                id_user,
            }, transaction);

            //* 7) ACTUALIZAR SALDO DE LA CUENTA CORRIENTE
            await supplier_account.update({
                balance: post_balance
            }, { transaction });

            //* 8) CREAR RELACIÓN DE COMPRA CON LA CUENTA CORRIENTE
            await PurchaseTransaction.create({
                id_purchase: purchase.id,
                id_supplier_account_transaction: account_transaction.id,
            }, { transaction });

            await transaction.commit();

            return { id: purchase.id, message: '¡La compra se creó correctamente!' };

        } catch (error: any) {
            await transaction.rollback();
            const errorMessages: Record<string, string> = {
                SequelizeValidationError: 'Ocurrió un error de VALIDACIÓN al crear la compra',
                SequelizeDatabaseError: 'Ocurrió un error de BASE DE DATOS al crear la compra',
                SequelizeUniqueConstraintError: 'Ocurrió un error de CONFLICTO al crear la compra',
                SequelizeForeignKeyConstraintError: 'Ocurrió un error de REFERENCIA al crear la compra',
            };

            const errorMessage = errorMessages[error.name] || 'Ocurrió un error desconocido al crear la compra';
            throw CustomError.internalServerError(errorMessage);
        }

    }

    public async nullifyPurchase(id: number, reason: string, id_user: number) {

        //* 1) OBTENER LA COMPRA
        const purchase = await Purchase.findByPk(id);
        if (!purchase) throw CustomError.notFound('¡La compra no existe!');

        const transaction: Transaction = await Purchase.sequelize!.transaction();

        try {

            //* 2) VERIFICAR SI LA COMPRA YA TIENE RECEPCIONES
            const itemsPurchase = await PurchaseItem.findAll({ where: { id_purchase: purchase.id } });
            const receivedItems = itemsPurchase.some(item => item.actual_stocked > 0);
            if (receivedItems) throw CustomError.badRequest('¡No se puede anular la compra porque ya se ha registrado una recepción!');

            //* 3) ANULAR LA COMPRA
            await purchase.update({
                status: 'ANULADA',
            }, { transaction });

            //* 4) REGISTRAR LA ANULACIÓN
            await PurchaseNullation.create({
                id_purchase: purchase.id,
                reason,
                id_user: id_user,
            }, { transaction });

            //* 5) ACTUALIZAR EL STOCK DE LOS PRODUCTOS
            for (const item of itemsPurchase) {
                try {
                    const quantity = Number(item.quantity);
                    await Product.update({
                        inc_stock: Sequelize.literal(`inc_stock - ${quantity}`),
                    }, { where: { id: item.id_product }, transaction });
                } catch (error) {
                    throw CustomError.internalServerError('Ocurrió un error al actualizar el stock a recibir de los productos');
                }
            }

            //* 6) OBTENER LA CUENTA CORRIENTE DEL PROVEEDOR
            const { id_supplier, id_currency } = purchase;
            const supplier_account = await SupplierAccount.findOne({
                where: { id_supplier, id_currency },
            });
            if (!supplier_account) throw CustomError.internalServerError('¡Error al buscar la cuenta corriente!');

            //* 7) CALCULAR BALANCES
            const prev_balance = Number(supplier_account.balance);
            const post_balance: number = Number(supplier_account.balance) + Number(purchase.total);

            //* 8) REGISTRAR TRANSACCIÓN DE ANULACIÓN
            const supplierAccountTransactionService = new SupplierAccountTransactionService();
            const { transaction: account_transaction } = await supplierAccountTransactionService.createTransactionDelPurchase({
                id_supplier_account: supplier_account.id,
                id_purchase: purchase.id,
                prev_balance,
                amount: purchase.total,
                post_balance,
                id_user,
            }, transaction);
            if (!account_transaction) throw CustomError.internalServerError('¡Error al registrar la transacción!');

            //* 9) ACTUALIZAR SALDO DE LA CUENTA CORRIENTE
            await supplier_account.update({
                balance: post_balance
            }, { transaction });

            //* 10) CREAR RELACIÓN DE COMPRA CON LA CUENTA CORRIENTE
            await PurchaseTransaction.create({
                id_purchase: purchase.id,
                id_supplier_account_transaction: account_transaction.id,
            }, { transaction });

            await transaction.commit();

            return { message: '¡Compra anulada correctamente. Se actualizaron los niveles de stock!' };

        } catch (error: any) {
            await transaction.rollback();
            const errorMessages: Record<string, string> = {
                SequelizeValidationError: 'Ocurrió un error de VALIDACIÓN al anular la compra',
                SequelizeDatabaseError: 'Ocurrió un error de BASE DE DATOS al anular la compra',
                SequelizeUniqueConstraintError: 'Ocurrió un error de CONFLICTO al anular la compra',
                SequelizeForeignKeyConstraintError: 'Ocurrió un error de REFERENCIA al anular la compra',
            };

            const errorMessage = errorMessages[error.name] || 'Ocurrió un error desconocido al anular la compra';
            throw CustomError.internalServerError(errorMessage);
        }
    }

    public async isPurchaseFullyStocked(id_purchase: number): Promise<boolean> {
        try {
            const purchase = await Purchase.findByPk(id_purchase, { include: ['items'] });
            if (!purchase || !purchase.items) throw CustomError.notFound('No se encontraron ítems de la compra');

            const fully_stocked = purchase.items.every(item => item.fully_stocked);
            if (fully_stocked && !purchase.fully_stocked) {
                await purchase.update({ fully_stocked: true });
                return true;
            }

            return false;
        } catch (error) {
            throw error;
        }
    }

    public async setPurchaseFullyStocked(id_purchase: number, id_user: number) {
        try {
            const purchase = await Purchase.findByPk(id_purchase);
            if (!purchase) throw CustomError.notFound('Compra no encontrada');
            const purchaseItemService = new PurchaseItemService();
            await purchaseItemService.updateAllItemsStock(id_purchase);
            await purchase.update({ fully_stocked: true });

            // REGISTRAR EL USUARIO QUE REGISTRÓ LA RECEPCIÓN
            const [detailError, detailDto] = ReceptionTotalDto.create({ id_purchase, id_user });
            if (detailError) throw CustomError.badRequest(detailError);
            const detailService = new ReceptionTotalService();
            if (detailDto) await detailService.createReceptionTotal(detailDto);

            return { message: '¡Stock de la compra actualizado correctamente!' };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async updateReceivedStock(updateItemDto: UpdateItemStockDto, id_user: number) {

        try {
            const purchaseItemService = new PurchaseItemService();
            const item = await purchaseItemService.updateItemStock(updateItemDto, id_user);
            const fully_stocked = await this.isPurchaseFullyStocked(updateItemDto.id_purchase);

            // REGISTRAR EL USUARIO QUE REGISTRÓ LA RECEPCIÓN
            const { quantity_received } = updateItemDto;
            const [detailError, detailDto] = ReceptionPartialDto.create({ id_purchase_item: item.id, id_user, quantity_received });
            if (detailError) throw CustomError.badRequest(detailError);
            const detailService = new ReceptionPartialService();
            if (detailDto) await detailService.createReceptionPartial(detailDto);

            return {
                fully_stocked,
                item: {
                    id: item.id,
                    quantity: Number(item.quantity),
                    actual_stocked: item.actual_stocked,
                    fully_stocked: item.fully_stocked,
                },
                message: '¡Stock actualizado correctamente!'
            };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }

    }

    public async getPurchaseReceptions(id_purchase: number) {
        try {
            const purchase = await Purchase.findByPk(id_purchase, {
                include: [{
                    association: 'items',
                    attributes: ['id', 'quantity'],
                    include: [{
                        association: 'product',
                        attributes: ['name']
                    }, {
                        association: 'receptions',
                        attributes: ['id', 'quantity_received', 'createdAt'],
                        include: [{
                            association: 'user',
                            attributes: ['name']

                        }]
                    },]
                }, {
                    association: 'reception',
                    attributes: ['id', 'createdAt'],
                    include: [{
                        association: 'user',
                        attributes: ['name']
                    }]
                }, {
                    association: 'supplier',
                    attributes: ['name']
                }]
            });

            if (!purchase) throw CustomError.notFound('Compra no encontrada');
            if (!purchase.items) throw CustomError.notFound('No se encontraron ítems de la compra');

            const partials_receptions = purchase.items.map(item => {
                if (!item.receptions || item.receptions.length === 0) return null;
                const receptions = item.receptions.map(reception => reception);
                return { id: item.id, product: item.product.name, quantity: item.quantity, receptions };
            }).filter(item => item !== null) as { id: number; product: string; quantity: number; receptions: [] }[];

            const partialsEntities = partials_receptions.map(item => PartialReceptionEntity.fromObject(item));
            const total_reception = purchase.reception ? TotalReceptionEntity.fromObject(purchase.reception) : null;
            const purchaseData = {
                id: purchase.id,
                date: purchase.date,
                supplier: purchase.supplier.name,
            }


            return { purchaseData, partials: partialsEntities, total: total_reception };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }

    }

}