export class LocalityDto {
    private constructor(
        public id_province: number,
        public name: string,
    ) { }

    static create(object: { [key: string]: any }): [string?, LocalityDto?] {
        const { id_province, name } = object;

        if (!id_province) return ['La provincia es requerida'];
        if (!name) return ['El nombre es requerido'];

        return [undefined, new LocalityDto(id_province, name)];
    }
}