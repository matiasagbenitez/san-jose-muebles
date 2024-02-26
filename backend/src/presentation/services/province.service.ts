import { Province, City, Country } from "../../database/mysql/models";
import { CustomError, ProvinceDto, ProvinceEntity } from "../../domain";

export class ProvinceService {

    public async getProvinces() {
        const provinces = await Province.findAll({
            include: [{
                model: Country,
                as: 'country'
            }]
        });
        const provincesEntities = provinces.map(province => ProvinceEntity.fromObjectWithCountry(province));
        return { provinces: provincesEntities };
    }

    public async getProvince(id: number) {
        const province = await Province.findByPk(id, {
            include: [{
                model: Country,
                as: 'country'
            }]
        });
        if (!province) throw CustomError.notFound('Province not found');
        const { ...provinceEntity } = ProvinceEntity.fromObjectWithCountry(province);
        return { province: provinceEntity };
    }

    public async createProvince(createProvinceDto: ProvinceDto) {
        const province = await Province.findOne({ where: { name: createProvinceDto.name, id_country: createProvinceDto.id_country } });
        if (province) throw CustomError.badRequest('Province already exists in the country');

        const country = await Country.findByPk(createProvinceDto.id_country);
        if (!country) throw CustomError.notFound('Country not found');

        try {
            const province = await Province.create({
                name: createProvinceDto.name,
                id_country: createProvinceDto.id_country
            });
            const { ...provinceEntity } = ProvinceEntity.fromObject(province);
            return { province: provinceEntity };
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
            if (existing && existing.id !== id) throw CustomError.badRequest('Province already exists in the country');

            await province.update({
                name: updateProvinceDto.name,
                id_country: updateProvinceDto.id_country
            });
            const { ...provinceEntity } = ProvinceEntity.fromObject(province);
            return { province: provinceEntity };
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
        if (!province) throw CustomError.notFound('Province not found');
        if (province.cities) {
            if (province.cities.length > 0) throw CustomError.badRequest('Province has cities');
        }

        try {
            await province.destroy();
            return { message: 'Province deleted' };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

}