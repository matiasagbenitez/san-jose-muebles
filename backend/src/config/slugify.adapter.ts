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

    filename: (text: string) => randomBytes(5).toString('hex') + '-' + slug.generate(text)
};