export class RelatedPersonDTO {
    private constructor(
        public readonly id_project: number,
        public readonly name: string,
        public readonly phone: string,
        public readonly relation: string,
        public readonly annotations: string,
    ) { }

    static create(object: { [key: string]: any }): [string?, RelatedPersonDTO?] {
        const { id_project, name, phone, relation, annotations } = object;

        if (!id_project) return ['Falta el ID del proyecto'];
        if (!name) return ['Falta el nombre'];

        return [undefined, new RelatedPersonDTO(
            id_project,
            name,
            phone,
            relation,
            annotations,
        )];
    }
}