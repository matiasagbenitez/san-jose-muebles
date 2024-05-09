import { Op } from "sequelize";
import { Project, ProjectAccount } from "../../database/mysql/models";
import { CustomError, PaginationDto, CreateProjectAccountDTO, ProjectAccountListEntity, ProjectAccountInfoEntity, ProjectBasicEntity, ProjectAccountEntity } from "../../domain";

export class ProjectAccountService {

    public async getProjectsAccountsPaginated(paginationDto: PaginationDto, filters: any) {
        const { page, limit } = paginationDto;

        // FILTERS
        let where = {};
        if (filters.balance) {
            if (filters.balance === 'positive') where = { ...where, balance: { [Op.gt]: 0 } };
            if (filters.balance === 'negative') where = { ...where, balance: { [Op.lt]: 0 } };
            if (filters.balance === 'zero') where = { ...where, balance: 0 };
        }
        if (filters.id_currency) where = { ...where, id_currency: filters.id_currency };
        if (filters.id_project) where = { ...where, id_project: filters.id_project };

        const [projectsAccounts, total] = await Promise.all([
            ProjectAccount.findAll({
                where,
                include: [
                    { association: 'currency', attributes: ['name', 'symbol', 'is_monetary'] },
                    { association: 'project', attributes: ['name'] }
                ],
                order: [['updatedAt', 'DESC']],
                limit,
                offset: (page - 1) * limit,
            }),
            ProjectAccount.count({ where })
        ]);

        // const items = projectsAccounts.map(item => ProjectAccountListEntity.fromObject(item));
        return { items: projectsAccounts, total_items: total };
    }


    // !DELETEABLE (! REVISAR)
    public async getProjectAccountById(id: number) {
        try {
            const account = await ProjectAccount.findByPk(id);
            if (!account) throw CustomError.notFound('Cuenta corriente no encontrada');
            return account;
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async updateProjectAccountBalance(id: number, balance: number) {
        try {
            const account = await this.getProjectAccountById(id);
            if (!account) throw CustomError.notFound('Cuenta corriente no encontrada');

            const updated = await account.update({ balance: balance });
            if (!updated) throw CustomError.internalServerError('¡Error al actualizar el saldo de la cuenta corriente!');

            return { account: updated, message: '¡Saldo actualizado correctamente!' };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async getAccountDataById(id: number) {
        try {
            const account = await ProjectAccount.findByPk(id, {
                include: [
                    { association: 'currency' },
                    {
                        association: 'project', include: [
                            { association: 'client', attributes: ['name', 'last_name'] },
                            { association: 'locality', attributes: ['name'] }
                        ]
                    }
                ]
            });
            if (!account) throw CustomError.notFound('Cuenta corriente no encontrada');

            const item = ProjectAccountEntity.fromObject(account);
            return { account: item };

        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async getProjectAccounts(id_project: number) {
        try {
            const [project, accounts] = await Promise.all([
                Project.findByPk(id_project, {
                    include: [
                        { association: 'client', attributes: ['name', 'last_name'] },
                        { association: 'locality', attributes: ['name'] },
                    ]
                }),
                ProjectAccount.findAll({
                    where: { id_project },
                    include: { association: 'currency', attributes: ['name', 'symbol', 'is_monetary'] },
                })
            ]);

            if (!project) throw CustomError.notFound('¡Proyecto no encontrado!');

            const entity = ProjectBasicEntity.fromObject(project);
            const entities = accounts.map(account => ProjectAccountListEntity.fromObject(account));

            return { project: entity, accounts: entities };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async createAccount(dto: CreateProjectAccountDTO) {
        try {
            const item = await ProjectAccount.create({ ...dto });
            const rec = await ProjectAccount.findByPk(item.id, {
                include: [
                    { association: 'currency', attributes: ['name', 'symbol', 'is_monetary'] },
                    {
                        association: 'project', attributes: ['title'], include: [
                            { association: 'client', attributes: ['name'] },
                            { association: 'locality', attributes: ['name'] }
                        ]
                    }
                ]
            });
            if (!rec) throw CustomError.internalServerError('¡Error al crear la cuenta corriente!');
            const { ...account } = ProjectAccountListEntity.fromObject(rec);
            return { account: account, message: '¡Cuenta corriente creada correctamente!' };
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw CustomError.badRequest('¡El proyecto ya tiene una cuenta corriente en esa moneda!');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async findOrCreateAccount(id_project: number, id_currency: number): Promise<ProjectAccount> {

        const account = await ProjectAccount.findOrCreate({
            where: { id_project, id_currency },
            defaults: { id_project, id_currency, balance: 0 }
        });

        if (!account) throw CustomError.internalServerError('¡Error al buscar o crear la cuenta corriente!');
        return account[0];
    }

}