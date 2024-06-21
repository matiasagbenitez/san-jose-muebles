import { Design, DesignFile } from "../../database/mysql/models";
import { CustomError } from "../../domain";
import { S3FileUpload, MulterFile } from "../../config";

interface FileToSave {
    id_design: number;
    description: string;
    slug: string;
    path: string;
    size: number;
    mimetype: string;
    image: boolean;
    id_user: number;
}

export class DesignFileService {

    public uploadDesignFiles = async (id_design: number, files: MulterFile[], id_user: number) => {
        try {
            const design = await Design.findByPk(id_design);
            if (!design) throw CustomError.notFound('¡Diseño no encontrado!');

            const filesToSave: FileToSave[] = [];
            const folder = `designs/${id_design}`;

            const promises = files.map(async (file: MulterFile) => {
                const { fileName, path } = await S3FileUpload.upload(file, folder);
                const fileToSave: FileToSave = {
                    id_design,
                    description: 'lorem ipsum',
                    slug: fileName,
                    path,
                    size: file.size,
                    mimetype: file.mimetype,
                    image: file.mimetype.includes('image'),
                    id_user
                };
                filesToSave.push(fileToSave);
            });

            await Promise.all(promises);
            await DesignFile.bulkCreate(filesToSave.map(file => ({ ...file })));

            return { message: '¡Los archivos se han subido correctamente!' };
        } catch (error: any) {
            console.log(error);
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async getDesignFiles(id_design: number) {
        try {
            const files = await DesignFile.findAll({
                where: { id_design }, order: [['createdAt', 'DESC']]
            });
            for (let file of files) {
                const url = await S3FileUpload.getFileUrl(file.path);
                file.setDataValue('fileUrl', url);
            }
            return { files };
        } catch (error) {
            console.log(error);
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async deleteFile(id_file: number) {
        try {
            const file = await DesignFile.findByPk(id_file);
            if (!file) throw CustomError.notFound('¡Archivo no encontrado!');

            await S3FileUpload.deleteFile(file.path);
            await file.destroy();

            return { ok: true, message: '¡El archivo se ha eliminado correctamente!' };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }
}
