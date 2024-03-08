export class ProvinceDto {
    private constructor(
        public id_country: number,
        public name: string,
    ) { }

    static create(object: { [key: string]: any }): [string?, ProvinceDto?] {
        const { id_country, name } = object;

        if (!id_country) return ['El país es requerido'];
        if (!name) return ['El nombre es requerido'];

        return [undefined, new ProvinceDto(id_country, name)];
    }
}