export class PaymentMethodDto {
    private constructor(
        public name: string,
    ) { }

    static create(object: { [key: string]: any }): [string?, PaymentMethodDto?] {
        const { name } = object;

        if (!name) return ['El nombre es requerido'];

        return [undefined, new PaymentMethodDto(name)];
    }
}