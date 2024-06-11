import { regularExps } from "../../../config";

export class UpdateUserDto {
    private constructor(
        public name: string,
        public username: string,
        public email: string,
        public phone?: string,
    ) { }

    static create(object: { [key: string]: any }): [string?, UpdateUserDto?] {
        const { name, username, email, phone } = object;

        if (!name) return ['Missing name'];
        if (!username) return ['Missing username'];
        if (!email) return ['Missing email'];
        if (!regularExps.email.test(email)) return ['Invalid email'];

        return [undefined, new UpdateUserDto(name, username, email, phone)];
    }
}