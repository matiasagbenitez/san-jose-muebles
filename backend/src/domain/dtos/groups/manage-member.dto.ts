export class ManageMemberDTO {
    private constructor(
        public id_group: number,
        public id_member: number,
    ) { }

    static create(object: { [key: string]: any }): [string?, ManageMemberDTO?] {
        const { id_group, id_member } = object;

        if (!id_group) return ['El ID del grupo es requerido'];
        if (!id_member) return ['El ID de la función es requerido'];

        return [undefined, new ManageMemberDTO(id_group, id_member)];
    }
}