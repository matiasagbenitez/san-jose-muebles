import { Op, Order } from "sequelize";
import { Estimate } from "../../database/mysql/models";
import {
    CustomError, PaginationDto,
    CreateEstimateDTO, EstimatesListEntity, EstimatesByProjectListEntity,
} from "../../domain";

export interface EstimateFilters {
    text?: string;
    status?: string;
}

export class EstimateService {

    public async getEstimates() {
        const rows = await Estimate.findAll();
        return { items: rows };
    }

    public async getEstimatesPaginated(paginationDto: PaginationDto, filters: EstimateFilters) {
        const { page, limit } = paginationDto;

        // FILTERS
        let where = {};
        if (filters.text) { where = { ...where, title: { [Op.like]: `%${filters.text}%` } }; }
        if (filters.status) {
            switch (filters.status) {
                case 'VALIDO':
                    where = { ...where, status: 'VALIDO' };
                    break;
                case 'ENVIADO':
                    where = { ...where, status: 'ENVIADO' };
                    break;
                case 'ACEPTADO':
                    where = { ...where, status: 'ACEPTADO' };
                    break;
                case 'RECHAZADO':
                    where = { ...where, status: 'RECHAZADO' };
                    break;
                case 'ANULADO':
                    where = { ...where, status: 'ANULADO' };
                case 'ALL':
                    break;
                default:
                    where = { ...where, status: 'ENVIADO' };
                    break;
            }
        }

        const [rows, total] = await Promise.all([
            Estimate.findAll({
                where,
                include: [{
                    association: 'project', include: [{
                        association: 'client',
                    }]
                }],
                offset: (page - 1) * limit,
                limit,
                // ORDER = en el orden que se definió en el modelo
                // order: [['status', 'ASC']],
            }),
            Estimate.count({ where })
        ]);
        const entities = rows.map(estimate => EstimatesListEntity.fromObject(estimate));
        return { items: entities, total_items: total };
    }

    public async getEstimate(id: number) {
        const estimate = await Estimate.findByPk(id, {
            include: [
                { association: 'project', include: [{ association: 'client', attributes: ['id', 'name', 'last_name'] }] },
                { association: 'currency', attributes: ['name', 'symbol', 'is_monetary'] },
                { association: 'user', attributes: ['name'] }
            ],
        });
        if (!estimate) throw CustomError.notFound('¡Presupuesto no encontrado!');
        const { ...entity } = estimate.toJSON();
        return { item: entity };
    }

    public async getEstimatesByProject(id_project: number) {
        const estimates = await Estimate.findAll({
            where: { id_project },
            include: [
                { association: 'project', include: [{ association: 'client', attributes: ['id', 'name', 'last_name'] }] },
                { association: 'currency', attributes: ['name', 'symbol', 'is_monetary'] },
                { association: 'user', attributes: ['name'] }
            ],
        });
        const entities = estimates.map(estimate => EstimatesByProjectListEntity.fromObject(estimate));
        return { items: entities };
    }

    public async createEstimate(dto: CreateEstimateDTO) {
        try {
            const { id } = await Estimate.create({ ...dto });
            return { id, message: '¡Presupuesto creado correctamente!' };
        } catch (error: any) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async deleteEstimate(id: number) {
        const estimate = await Estimate.findByPk(id);
        if (!estimate) throw CustomError.notFound('¡Presupuesto no encontrado!');

        try {
            await estimate.destroy();
            return { message: '¡Presupuesto eliminado correctamente!' };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

}