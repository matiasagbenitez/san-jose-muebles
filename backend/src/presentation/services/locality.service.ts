import { Op } from "sequelize";
import { Province, Locality, Country } from "../../database/mysql/models";
import { LocalityDto, LocalityEntity, CustomError, PaginationDto } from "../../domain";

export interface LocalityFilters {
    name: string;
}
export class LocalityService {

    public async getLocalities() {
        const localities = await Locality.findAll({
            include: [{
                model: Province,
                as: 'province'
            }]
        });
        const localitiesEntities = localities.map(locality => LocalityEntity.fromObjectWithProvince(locality));
        return { localities: localitiesEntities };
    }

    public async getLocalitiesPaginated(paginationDto: PaginationDto, filters: LocalityFilters) {
        const { page, limit } = paginationDto;

        // FILTERS
        let where = {};
        if (filters.name) where = { ...where, name: { [Op.like]: `%${filters.name}%` } };

        const [localities, total] = await Promise.all([
            Locality.findAll({
                where,
                include: [{
                    model: Province,
                    as: 'province',
                    include: [{
                        model: Country,
                        as: 'country'
                    }]
                }],
                offset: (page - 1) * limit,
            }),
            Locality.count({ where })
        ]);
        const localitiesEntities = localities.map(locality => LocalityEntity.fromObjectWithProvinceAndCountry(locality));
        return { items: localitiesEntities, total_items: total };
    }

    public async getLocality(id: number) {
        const locality = await Locality.findByPk(id, {
            include: [{
                model: Province,
                as: 'province',
            }]
        });
        if (!locality) throw CustomError.notFound('Localidad no encontrada');
        const { ...localityEntity } = LocalityEntity.fromObjectWithProvince(locality);
        return { locality: localityEntity };
    }

    public async createLocality(createLocalityDto: LocalityDto) {
        const province = await Province.findByPk(createLocalityDto.id_province);
        if (!province) throw CustomError.notFound('Provincia no encontrada');

        const locality = await Locality.findOne({ where: { name: createLocalityDto.name, id_province: createLocalityDto.id_province } });
        if (locality) throw CustomError.badRequest('La localidad ya existe en la provincia');

        try {
            const locality = await Locality.create({
                name: createLocalityDto.name,
                id_province: createLocalityDto.id_province
            });
            const { ...localityEntity } = LocalityEntity.fromObject(locality);
            return { locality: localityEntity, message: 'Localidad creada correctamente' };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async updateLocality(id: number, updateLocalityDto: LocalityDto) {
        const locality = await Locality.findByPk(id);
        if (!locality) throw CustomError.notFound('Localidad no encontrada');

        try {
            const province = await Province.findByPk(updateLocalityDto.id_province);
            if (!province) throw CustomError.notFound('Provincia no encontrada');

            // Validate if the locality already exists in the province
            const existing = await Locality.findOne({ where: { name: updateLocalityDto.name, id_province: updateLocalityDto.id_province } });
            if (existing && existing.id !== id) throw CustomError.badRequest('La localidad ya existe en la provincia');

            await locality.update({
                name: updateLocalityDto.name,
                id_province: updateLocalityDto.id_province
            });
            const { ...localityEntity } = LocalityEntity.fromObject(locality);
            return { locality: localityEntity, message: 'Localidad actualizada correctamente' };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async deleteLocality(id: number) {
        const locality = await Locality.findByPk(id, {
            // TODO: clients, orders, etc
        });
        if (!locality) throw CustomError.notFound('Localidad no encontrada');

        try {
            await locality.destroy();
            return { message: 'Localidad eliminada correctamente' };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

}