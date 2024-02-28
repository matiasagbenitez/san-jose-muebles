import { Op } from "sequelize";
import { Province, City, Country } from "../../database/mysql/models";
import { CustomError, ProvinceDto, ProvinceEntity, PaginationDto } from "../../domain";

export interface ProvinceFilters {
    name: string;
}
export class ProvinceService {

    public async getProvinces() {
        const provinces = await Province.findAll();
        const provincesEntities = provinces.map(province => ProvinceEntity.fromObject(province));
        return { items: provincesEntities };
    }

    public async getProvincesPaginated(paginationDto: PaginationDto, filters: ProvinceFilters) {
        const { page, limit } = paginationDto;

        // FILTERS
        let where = {};
        if (filters.name) where = { ...where, name: { [Op.like]: `%${filters.name}%` } };

        const [provinces, total] = await Promise.all([
            Province.findAll({
                where,
                include: [{
                    model: Country,
                    as: 'country'
                }],
                offset: (page - 1) * limit,
            }),
            Province.count({ where })
        ]);
        const provincesEntities = provinces.map(province => ProvinceEntity.fromObjectWithCountry(province));
        return { items: provincesEntities, total_items: total };
    }

    public async getProvince(id: number) {
        const province = await Province.findByPk(id, {
            include: [{
                model: Country,
                as: 'country'
            }]
        });
        if (!province) throw CustomError.notFound('Provincia no encontrada');
        const { ...provinceEntity } = ProvinceEntity.fromObjectWithCountry(province);
        return { province: provinceEntity };
    }

    public async createProvince(createProvinceDto: ProvinceDto) {
        const country = await Country.findByPk(createProvinceDto.id_country);
        if (!country) throw CustomError.notFound('País no encontrado');
     
        const province = await Province.findOne({ where: { name: createProvinceDto.name, id_country: createProvinceDto.id_country } });
        if (province) throw CustomError.badRequest('La provincia ya existe en el país');

        try {
            const province = await Province.create({
                name: createProvinceDto.name,
                id_country: createProvinceDto.id_country
            });
            const { ...provinceEntity } = ProvinceEntity.fromObject(province);
            return { province: provinceEntity, message: 'Provincia creada correctamente' };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async updateProvince(id: number, updateProvinceDto: ProvinceDto) {
        const province = await Province.findByPk(id);
        if (!province) throw CustomError.notFound('Province not found');

        try {
            const country = await Country.findByPk(updateProvinceDto.id_country);
            if (!country) throw CustomError.notFound('Country not found');

            // Validate if the province already exists in the country
            const existing = await Province.findOne({ where: { name: updateProvinceDto.name, id_country: updateProvinceDto.id_country } });
            if (existing && existing.id !== id) throw CustomError.badRequest('La provincia ya existe en el país');

            await province.update({
                name: updateProvinceDto.name,
                id_country: updateProvinceDto.id_country
            });
            const { ...provinceEntity } = ProvinceEntity.fromObject(province);
            return { province: provinceEntity, message: 'Provincia actualizada correctamente' };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async deleteProvince(id: number) {
        const province = await Province.findByPk(id, {
            include: [{
                model: City,
                as: 'cities'
            }]
        });
        if (!province) throw CustomError.notFound('Provincia no encontrada');
        if (province.cities) {
            if (province.cities.length > 0) throw CustomError.badRequest('No se puede eliminar la provincia, tiene ciudades asociadas');
        }

        try {
            await province.destroy();
            return { message: 'Provincia eliminada correctamente' };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

}