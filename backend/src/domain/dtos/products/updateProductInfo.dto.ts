export class ProductInfoDto {
    private constructor(
        public id_brand: number,
        public id_category: number,
        public name: string,
        public code: string = '',
        public description: string = '',
    ) { }

    static create(object: { [key: string]: any }): [string?, ProductInfoDto?] {
        const {
            id_brand,
            id_category,
            name,
            code,
            description,
        } = object;

        if (!id_brand) return ['La marca es requerida'];
        if (!id_category) return ['La categoría es requerida'];
        if (!name) return ['El nombre es requerido'];


        return [undefined, new ProductInfoDto(
            id_brand,
            id_category,
            name,
            code,
            description,
        )];
    }
}