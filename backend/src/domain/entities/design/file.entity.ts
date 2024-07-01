import { CustomError } from '../../errors/custom.error';

export class DesignFileEntity {
    constructor(
        public id: string,
        public originalname: string,
        public fileUrl: string,
        public mimetype: string,
        public image: boolean,
        public user: string,
        public createdAt: Date,
    ) { }

    static fromObject(object: { [key: string]: any }): DesignFileEntity {
        const { id, originalname, fileUrl, mimetype, image, user, createdAt } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!originalname) throw CustomError.badRequest('Falta el nombre del archivo');
        if (!fileUrl) throw CustomError.badRequest('Falta la URL del archivo');
        if (!mimetype) throw CustomError.badRequest('Falta el tipo de archivo');
        if (image === undefined) throw CustomError.badRequest('Falta el tipo de archivo');
        if (!user) throw CustomError.badRequest('Falta el usuario');

        return new DesignFileEntity(
            id,
            originalname,
            fileUrl,
            mimetype,
            image,
            user.name,
            createdAt,
        );
    }
}