export class CurrencyDto {
    private constructor(
        public name: string,
        public symbol: string,
        public is_monetary: boolean = true,
    ) { }

    static create(object: { [key: string]: any }): [string?, CurrencyDto?] {
        const { name, symbol, is_monetary } = object;

        if (!name) return ['El nombre es requerido'];
        if (!symbol) return ['El símbolo es requerido'];

        return [undefined, new CurrencyDto(name, symbol, is_monetary)];
    }
}