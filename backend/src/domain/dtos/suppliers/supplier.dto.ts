export class SupplierDto {
    private constructor(
        public name: string,
        public dni_cuit: string,
        public phone: string,
        public email: string,
        public address: string,
        public id_locality: number,
        public annotations: string
    ) { }

    static create(object: { [key: string]: any }): [string?, SupplierDto?] {
        const { name, dni_cuit, phone, email, address, id_locality, annotations } = object;

        if (!name) return ['El nombre es requerido'];
        if (!id_locality) return ['La localidad es requerida'];

        return [undefined, new SupplierDto(name, dni_cuit, phone, email, address, id_locality, annotations)];
    }
}