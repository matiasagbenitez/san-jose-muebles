
import { parse } from 'path';

export const normalizeFileName = (fileName: string): string => {
    const normalized = fileName.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    const safeName = normalized.replace(/[^a-zA-Z0-9\.\-]/g, ' ');

    // Ensure the file extension is preserved
    const { name, ext } = parse(safeName);

    return `${name}${ext}`;
}
