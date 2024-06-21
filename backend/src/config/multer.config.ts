// src/config/multer.config.ts
import multer from 'multer';

class MulterConfig {
    private static instance: MulterConfig;

    private constructor() { }

    public static getInstance() {
        if (!MulterConfig.instance) {
            MulterConfig.instance = new MulterConfig();
        }
        return MulterConfig.instance;
    }

    public get memoryStorage() {
        return multer.memoryStorage();
    }

    public getMemoryUpload(singleField: string, multipleField: string, maxCount: number) {
        return {
            single: multer({ storage: this.memoryStorage }).single(singleField),
            multiple: multer({ storage: this.memoryStorage }).array(multipleField, maxCount)
        };
    }

}

export default MulterConfig.getInstance();