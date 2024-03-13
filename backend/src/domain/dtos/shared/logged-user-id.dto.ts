export class LoggedUserIdDto {
    private constructor(
        public id_user: number,
    ) { }

    static create(object: { [key: string]: any }): [string?, LoggedUserIdDto?] {
        const { id_user } = object;

        if (!id_user) return ['No se logró obtener el ID del usuario en la petición'];

        return [undefined, new LoggedUserIdDto(
            id_user,
        )];
    }
}