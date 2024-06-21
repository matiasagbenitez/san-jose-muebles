import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { slug } from "./slugify.adapter";
import { envs } from "./envs";

const s3 = new S3Client({
    credentials: {
        accessKeyId: envs.S3_ACCESS_KEY,
        secretAccessKey: envs.S3_SECRET_ACCESS_KEY
    },
    region: envs.S3_REGION
});

export interface MulterFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
}

export class S3FileUpload {

    static async upload(file: MulterFile, folder: string = ''): Promise<{ fileName: string, path: string }> {

        if (!file || !file.buffer) throw new Error('¡No se ha subido ningún archivo!');

        try {
            const { originalname, buffer, mimetype } = file;
            const fileName = slug.filename(originalname);
            const folderName = folder ? `${folder}/` : '';
            const path = `${folderName}${fileName}`;

            const putObjectParams = {
                Bucket: envs.S3_BUCKET,
                Key: path,
                Body: buffer,
                ContentType: mimetype,
            };

            const command = new PutObjectCommand(putObjectParams);
            await s3.send(command);

            return { fileName, path };

        } catch (error: any) {
            throw new Error(`Error al subir archivo: ${error.message || error}`);
        }
    }

    static async getFileUrl(fileName: string, expiresIn: number = 600): Promise<string> {

        try {
            const getObjectParams = {
                Bucket: envs.S3_BUCKET,
                Key: fileName
            };

            const command = new GetObjectCommand(getObjectParams);
            const url = await getSignedUrl(s3, command, { expiresIn });

            return url;

        } catch (error: any) {
            throw new Error(`Error al obtener la URL del archivo: ${error.message || error}`);
        }
    }

    static async deleteFile(fileName: string): Promise<{ message: string }> {

        try {
            const deleteObjectParams = {
                Bucket: envs.S3_BUCKET,
                Key: fileName
            };

            const command = new DeleteObjectCommand(deleteObjectParams);
            await s3.send(command);

            return { message: '¡Archivo eliminado correctamente!' };

        } catch (error: any) {
            throw new Error(`Error al eliminar archivo: ${error.message || error}`);
        }
    }
}
