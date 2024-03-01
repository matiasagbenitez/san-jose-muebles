import { Op } from "sequelize";
import { UnitOfMeasure } from "../../database/mysql/models";
import { CustomError, UnitOfMeasureDto, UnitOfMeasureEntity, PaginationDto } from "../../domain";

export interface UnitOfMeasureFilters {
    name: string;
}
export class UnitOfMeasureService {

    public async getUnitOfMeasures() {
        const unitsOfMeasure = await UnitOfMeasure.findAll();
        const unitsOfMeasureEntities = unitsOfMeasure.map(unitOfMeasure => UnitOfMeasureEntity.fromObject(unitOfMeasure));
        return { items: unitsOfMeasureEntities };
    }

    public async getUnitOfMeasuresPaginated(paginationDto: PaginationDto, filters: UnitOfMeasureFilters) {
        const { page, limit } = paginationDto;

        // FILTERS
        let where = {};
        if (filters.name) where = { ...where, name: { [Op.like]: `%${filters.name}%` } };

        const [unitsOfMeasure, total] = await Promise.all([
            UnitOfMeasure.findAll({ where, offset: (page - 1) * limit, limit }),
            UnitOfMeasure.count({ where })
        ]);
        const unitsOfMeasureEntities = unitsOfMeasure.map(unitOfMeasure => UnitOfMeasureEntity.fromObject(unitOfMeasure));
        return { items: unitsOfMeasureEntities, total_items: total };
    }

    public async getUnitOfMeasure(id: number) {
        const unitOfMeasure = await UnitOfMeasure.findByPk(id);
        if (!unitOfMeasure) throw CustomError.notFound('Unidad de medida no encontrada');
        const { ...unitOfMeasureEntity } = UnitOfMeasureEntity.fromObject(unitOfMeasure);
        return { unitOfMeasure: unitOfMeasureEntity };
    }

    public async createUnitOfMeasure(createUnitOfMeasureDto: UnitOfMeasureDto) {
        const unitOfMeasure = await UnitOfMeasure.findOne({ where: { name: createUnitOfMeasureDto.name } });
        if (unitOfMeasure) throw CustomError.badRequest('La unidad de medida ya existe');

        try {
            const unitOfMeasure = await UnitOfMeasure.create({
                name: createUnitOfMeasureDto.name,
                symbol: createUnitOfMeasureDto.symbol
            });
            const { ...unitOfMeasureEntity } = UnitOfMeasureEntity.fromObject(unitOfMeasure);
            return { unitOfMeasure: unitOfMeasureEntity, message: 'Unidad de medida creada correctamente' };
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw CustomError.badRequest('La unidad de medida que intenta crear ya existe');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async updateUnitOfMeasure(id: number, updateUnitOfMeasureDto: UnitOfMeasureDto) {
        const unitOfMeasure = await UnitOfMeasure.findByPk(id);
        if (!unitOfMeasure) throw CustomError.notFound('Unidad de medida no encontrada');

        try {
            await unitOfMeasure.update(updateUnitOfMeasureDto);
            const { ...unitOfMeasureEntity } = UnitOfMeasureEntity.fromObject(unitOfMeasure);
            return { unitOfMeasure: unitOfMeasureEntity, message: 'Unidad de medida actualizada correctamente' };
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw CustomError.badRequest('La unidad de medida que intenta actualizar ya existe');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async deleteUnitOfMeasure(id: number) {
        const unitOfMeasure = await UnitOfMeasure.findByPk(id);
        if (!unitOfMeasure) throw CustomError.notFound('Unidad de medida no encontrada');
        
        try {
            await unitOfMeasure.destroy();
            return { message: 'Unidad de medida eliminada correctamente' };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

}