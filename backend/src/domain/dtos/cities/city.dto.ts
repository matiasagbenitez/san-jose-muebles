export class CityDto {
    private constructor(
        public id_province: number,
        public name: string,
    ) { }

    static create(object: { [key: string]: any }): [string?, CityDto?] {
        const { id_province, name } = object;

        if (!id_province) return ['La provincia es requerida'];
        if (!name) return ['El nombre es requerido'];

        return [undefined, new CityDto(id_province, name)];
    }
}