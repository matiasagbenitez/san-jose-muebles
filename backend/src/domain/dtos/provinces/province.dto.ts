export class ProvinceDto {
    private constructor(
        public id_country: number,
        public name: string,
    ) { }

    static create(object: { [key: string]: any }): [string?, ProvinceDto?] {
        const { id_country, name } = object;

        if (!id_country) return ['Missing country id'];
        if (!name) return ['Missing name'];

        return [undefined, new ProvinceDto(id_country, name)];
    }
}