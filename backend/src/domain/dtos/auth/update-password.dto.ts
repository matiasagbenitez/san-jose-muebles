export class UpdatePasswordDto {
    private constructor(
        public password: string,
        public new_password: string,
    ) { }

    static create(object: { [key: string]: any }): [string?, UpdatePasswordDto?] {
        const { password, new_password, new_password_confirm } = object;

        if (!password) return ['¡Falta la contraseña actual!'];
        if (!new_password) return ['¡Falta la nueva contraseña!'];
        if (!new_password_confirm) return ['¡Falta la confirmación de la contraseña!'];
        if (new_password !== new_password_confirm) return ['¡Las contraseñas no coinciden!'];

        return [undefined, new UpdatePasswordDto(password, new_password)];
    }
}