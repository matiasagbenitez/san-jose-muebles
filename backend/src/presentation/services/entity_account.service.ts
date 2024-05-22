import { Op } from "sequelize";
import { Entity, EntityAccount } from "../../database/mysql/models";
import { CustomError, PaginationDto, CreateEntityAccountDTO, EntityAccountListEntity, EntityBasicEntity, EntityAccountEntity, EntityAccountGeneralListEntity } from "../../domain";

export class EntityAccountService {

    public async getEntitiesAccountsPaginated(paginationDto: PaginationDto, filters: any) {
        const { page, limit } = paginationDto;

        // FILTERS
        let where = {};
        if (filters.balance) {
            if (filters.balance === 'positive') where = { ...where, balance: { [Op.gt]: 0 } };
            if (filters.balance === 'negative') where = { ...where, balance: { [Op.lt]: 0 } };
            if (filters.balance === 'zero') where = { ...where, balance: 0 };
        }
        if (filters.id_currency) where = { ...where, id_currency: filters.id_currency };
        if (filters.id_entity) where = { ...where, id_entity: filters.id_entity };

        const [rows, total] = await Promise.all([
            EntityAccount.findAll({
                where,
                include: [
                    { association: 'currency', attributes: ['name', 'symbol', 'is_monetary'] },
                    { association: 'entity', attributes: ['id', 'name'] }
                ],
                order: [['updatedAt', 'DESC']],
                limit,
                offset: (page - 1) * limit,
            }),
            EntityAccount.count({ where })
        ]);

        const entities = rows.map(row => EntityAccountGeneralListEntity.fromObject(row));
        return { items: entities, total_items: total };
    }

    public async getAccountDataById(id_entity: number, id_entity_account: number) {
        // console.log(id);
        try {
            const account = await EntityAccount.findOne({
                where: {
                    id: id_entity_account,
                    id_entity
                },
                include: [
                    { association: 'currency' },
                    {
                        association: 'entity', include: [
                            { association: 'locality', attributes: ['name'] }
                        ]
                    }
                ]
            });
            if (!account) throw CustomError.notFound('¡Cuenta corriente no encontrada!');
            const item = EntityAccountEntity.fromObject(account);

            return { account: item };

        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async getEntityAccounts(id_entity: number) {
        try {
            const [entity, accounts] = await Promise.all([
                Entity.findByPk(id_entity, {
                    include: [{ association: 'locality', attributes: ['name'] }],
                }),
                EntityAccount.findAll({
                    where: { id_entity },
                    include: { association: 'currency', attributes: ['name', 'symbol', 'is_monetary'] },
                })
            ]);

            if (!entity) throw CustomError.notFound('¡Entidad no encontrada!');

            const entityObj = EntityBasicEntity.fromObject(entity);
            const entities = accounts.map(account => EntityAccountListEntity.fromObject(account));

            return { entity: entityObj, accounts: entities };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async createAccount(dto: CreateEntityAccountDTO) {
        try {
            await EntityAccount.create({ ...dto });
            return { message: '¡Cuenta corriente creada correctamente!' };
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw CustomError.badRequest('¡La entidad ya tiene una cuenta corriente en esa moneda!');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

}