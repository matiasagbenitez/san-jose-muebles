export class CountryDto {
    private constructor(
        public name: string,
    ) { }

    static create(object: { [key: string]: any }): [string?, CountryDto?] {
        const { name } = object;

        if (!name) return ['El nombre es requerido'];

        return [undefined, new CountryDto(name)];
    }
}