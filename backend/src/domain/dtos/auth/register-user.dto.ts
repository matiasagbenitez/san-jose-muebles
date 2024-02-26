import { regularExps } from "../../../config";

export class RegisterUserDto {
    private constructor(
        public name: string,
        public username: string,
        public email: string,
        public password: string,
        public phone?: string,
    ) { }

    static create(object: { [key: string]: any }): [string?, RegisterUserDto?] {
        const { name, username, email, password, phone } = object;

        if (!name) return ['Missing name'];
        if (!username) return ['Missing username'];
        if (!email) return ['Missing email'];
        if (!regularExps.email.test(email)) return ['Invalid email'];
        if (!password) return ['Missing password'];

        return [undefined, new RegisterUserDto(name, username, email, password, phone)];
    }
}