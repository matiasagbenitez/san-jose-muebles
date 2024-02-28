export class CurrencyDto {
    private constructor(
        public name: string,
        public code: string,
    ) { }

    static create(object: { [key: string]: any }): [string?, CurrencyDto?] {
        const { name, code } = object;

        if (!name) return ['El nombre es requerido'];
        if (!code) return ['El código es requerido'];

        return [undefined, new CurrencyDto(name, code)];
    }
}