import slugify from 'slugify';
import { randomBytes } from 'crypto';

export const slug = {
    generate: (text: string) => {
        return slugify(text, {
            lower: true,
            remove: /[*+~()'"!:@]/g,
            locale: 'es'
        });
    },

    filename: (text: string) => randomBytes(5).toString('hex') + '-' + slug.generate(text),

    create(text: string): [string, string] {

        const normalized = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9\_\.\-]/g, ' ');

        const sluglified = slug.filename(normalized);

        return [normalized, sluglified];
    }
};