import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';

export class DateFormatter {
    constructor() { }

    /** 09/12/2018 */
    static toDMYYYY(date: Date): string {
        return dayjs(date).format('DD/MM/YYYY');
    }

    static toDMYY(date: Date): string {
        return dayjs(date).format('DD/MM/YY');
    }

    /** 09/12/2018 12:00 */
    static toDMYH(date: Date): string {
        return dayjs(date).format('DD/MM/YYYY HH:mm');
    }

    /** 09 de diciembre de 2018 */
    static toDMYText(date: Date): string {
        dayjs.extend(updateLocale);
        dayjs.updateLocale('en', {
            months: [
                'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
            ]
        });
        return dayjs(date, 'DD-MMM-YYYY').format('DD [de] MMMM [de] YYYY');
    }

    /** 09 de diciembre de 2018, 12:00 */
    static toDMYHText(date: Date): string {
        dayjs.extend(updateLocale);
        dayjs.updateLocale('en', {
            months: [
                'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
            ]
        });
        return dayjs(date, 'DD-MMM-YYYY HH:mm').format('DD [de] MMMM [de] YYYY, HH:mm');
    }

    /** jueves, 9 de diciembre de 2018 */
    static toWDMYText(date: Date): string {
        const new_date = new Date(date);
        const formatted = new_date.toLocaleDateString('es-ES', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
        return formatted;
    }

    /** jueves, 9 de diciembre de 2018, 12:00 */
    static toWDMYHText(date: Date): string {
        const new_date = new Date(date);
        const formatted = new_date.toLocaleDateString('es-ES', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        });
        return formatted;
    }

    /** diciembre de 2018 */
    static toMYText(date: Date): string {
        const new_date = new Date(date);
        const formatted = new_date.toLocaleDateString('es-ES', {
            month: 'long',
            year: 'numeric',
        });
        return formatted;
    }

}