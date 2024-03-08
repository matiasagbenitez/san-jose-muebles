export class UnitOfMeasureDto {
    private constructor(
        public name: string,
        public symbol: string,
    ) { }

    static create(object: { [key: string]: any }): [string?, UnitOfMeasureDto?] {
        const { name, symbol } = object;

        if (!name) return ['El nombre es requerido'];
        if (!symbol) return ['El símbolo es requerido'];

        return [undefined, new UnitOfMeasureDto(name, symbol)];
    }
}