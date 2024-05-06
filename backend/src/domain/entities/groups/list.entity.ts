import { CustomError } from '../../errors/custom.error';

export class GroupListEntity {
    constructor(
        public id: string,
        public name: string,
        public group_function: string,
    ) { }

    static fromObject(object: { [key: string]: any }): GroupListEntity {

        const { id, name, group_function } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!name) throw CustomError.badRequest('Falta el nombre del grupo');
        if (!group_function) throw CustomError.badRequest('Falta la función del grupo');

        return new GroupListEntity(
            id,
            name,
            group_function.name,
        );
    }
}