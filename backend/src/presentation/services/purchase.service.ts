import { Op, Sequelize } from "sequelize";
import { Purchase, SupplierAccountTransaction, User } from "../../database/mysql/models";
import { CustomError, NewPurchaseDto, PaginationDto, ListablePurchaseEntity, DetailPurchaseEntity, UpdateItemStockDto, ReceptionPartialDto, ReceptionTotalDto, PartialReceptionEntity, TotalReceptionEntity, SupplierAccountDto } from "../../domain";
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
    nullified: string | undefined;
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
            where = { ...where, fully_stocked: true, nullified: false };
        } else if (filters.stock === 'not_fully_stocked') {
            where = { ...where, fully_stocked: false, nullified: false };
        }

        if (filters.nullified === 'true') {
            where = { ...where, nullified: true };
        } else if (filters.nullified === 'false') {
            where = { ...where, nullified: false };
        }

        const [purchases, total] = await Promise.all([
            Purchase.findAll({
                where,
                include: ['supplier', 'currency'],
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
            attributes: {
                exclude: ['id_supplier', 'id_currency', 'created_by', 'nullified_by'],
            },
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
                association: 'creator',
                attributes: ['name']
            }, {
                association: 'nullifier',
                attributes: ['name']
            }],

        });

        if (!purchase) throw CustomError.notFound('Compra no encontrada');
        const { ...entity } = DetailPurchaseEntity.fromObject(purchase);
        return { purchase: entity };
    }

    public async createPurchase(form: NewPurchaseDto, id_user: number) {

        try {
            const { products_list, ...rest } = form;

            // CREAR CUENTA CORRIENTE SI NO EXISTE
            const { id_supplier, id_currency } = rest;
            const supplierAccountService = new SupplierAccountService();
            const supplierAccount = await supplierAccountService.findOrCreateAccount(id_supplier, id_currency);

            // CREAR COMPRA
            const purchase = await Purchase.create({
                ...rest,
                created_by: id_user,
                nullified_by: id_user,
            });

            // ASOCIAR PRODUCTOS A LA COMPRA
            const purchaseItemService = new PurchaseItemService();
            purchaseItemService.createItems(purchase.id, id_currency, products_list);

            // CALCULAR BALANCE ACTUAL DE LA CUENTA CORRIENTE
            const balance: number = Number(supplierAccount.balance) - Number(purchase.total);

            // REGISTRAR TRANSACCIÓN A CUENTA DEL PROVEEDOR
            const supplierAccountTransactionService = new SupplierAccountTransactionService();
            const { transaction } = await supplierAccountTransactionService.createInTransactionFromPurchase({
                id_supplier_account: supplierAccount.id,
                id_purchase: purchase.id,
                amount: purchase.total,
                balance: balance,
                id_user,
            });

            // ACTUALIZAR SALDO DE LA CUENTA CORRIENTE
            await supplierAccount.update({
                balance: balance
            });

            // CREAR RELACIÓN DE COMPRA CON LA CUENTA CORRIENTE
            const purchaseTransactionService = new PurchaseTransactionService();
            await purchaseTransactionService.createPurchaseTransaction({
                id_purchase: purchase.id,
                id_supplier_account_transaction: transaction.id,
            });

            return { id: purchase.id, message: '¡La compra se creó correctamente!' };

        } catch (error: any) {
            if (error.name === 'SequelizeValidationError') {
                throw CustomError.badRequest(`Ocurrió un error al crear la compra: ${error.errors[0].message}`);
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async checkFullyStocked(id_purchase: number): Promise<boolean> {
        try {
            const purchase = await Purchase.findByPk(id_purchase, { include: ['items'] });
            if (!purchase || !purchase.items) throw CustomError.notFound('No se encontraron ítems de la compra');

            const fully_stocked = purchase.items.every(item => item.fully_stocked);
            if (fully_stocked) {
                await purchase.update({ fully_stocked: true });
                return true;
            }

            return false;
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async updateReceivedStock(updateItemDto: UpdateItemStockDto, id_user: number) {

        try {
            const purchaseItemService = new PurchaseItemService();
            const item = await purchaseItemService.updateItemStock(updateItemDto, id_user);
            const fully_stocked = await this.checkFullyStocked(updateItemDto.id_purchase);

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


    public async nullifyPurchase(id: number, reason: string, id_user: number) {
        const purchase = await Purchase.findByPk(id);
        if (!purchase) throw CustomError.notFound('Compra no encontrada');

        try {

            const purchaseItemService = new PurchaseItemService();
            const hasOneItemReceived = await purchaseItemService.hasOneItemReceived(id);
            if (hasOneItemReceived) throw CustomError.badRequest('¡No se puede anular la compra porque ya se ha registrado una recepción!');

            const user = await User.findByPk(id_user);
            if (!user) throw CustomError.notFound('Usuario no encontrado');

            const now = Date.now();

            await purchase.update({
                nullified: true, nullified_by: user.id, nullified_reason: reason, nullified_date: now
            })

            const nullifiedData = {
                nullifier: user.name,
                nullified_reason: reason,
                nullified_date: now
            }

            await purchaseItemService.decreaseIncomingStockByCancellation(id);

            // CREAR CUENTA CORRIENTE SI NO EXISTE
            const { id_supplier, id_currency } = purchase;
            const supplierAccountService = new SupplierAccountService();
            const supplierAccount = await supplierAccountService.findOrCreateAccount(id_supplier, id_currency);

            //  CALCULAR BALANCE ACTUAL DE LA CUENTA CORRIENTE
            const balance: number = Number(supplierAccount.balance) + Number(purchase.total);

            // REGISTRAR TRANSACCIÓN A CUENTA DEL PROVEEDOR
            const supplierAccountTransactionService = new SupplierAccountTransactionService();
            const { transaction } = await supplierAccountTransactionService.createOutTransactionFromPurchase({
                id_supplier_account: supplierAccount.id,
                id_purchase: purchase.id,
                amount: purchase.total,
                balance: balance,
                id_user,
            });

            // ACTUALIZAR SALDO DE LA CUENTA CORRIENTE
            await supplierAccount.update({
                balance: balance
            });

            // CREAR RELACIÓN DE COMPRA CON LA CUENTA CORRIENTE
            const purchaseTransactionService = new PurchaseTransactionService();
            await purchaseTransactionService.createPurchaseTransaction({
                id_purchase: purchase.id,
                id_supplier_account_transaction: transaction.id,
            });

            return { nullifiedData, message: 'Compra anulada correctamente. Se reestableció el stock de los productos incluidos.' };
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