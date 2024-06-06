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
        dayjs.extend(updateLocale);
        dayjs.updateLocale('en', {
            days: [
                'domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'
            ],
            months: [
                'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
            ]
        });
        return dayjs(date, 'DD-MMM-YYYY').format('dddd, DD [de] MMMM [de] YYYY');
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

    // Difference between two dates
    static difference(date: Date): string {

        const now = new Date();
        const date1 = dayjs(now);
        const date2 = dayjs(date);

        // Si la diferencia es menor a 1 día, se muestra en horas
        if (date1.diff(date2, 'day') < 1) {
            return `hoy a las ${dayjs(date2).format('HH:mm')}`;
        }

        // Si la diferencia es menor a 1 semana, se muestra en días
        if (date1.diff(date2, 'day') < 2) {
            return `ayer a las ${dayjs(date2).format('HH:mm')}`;
        }

        return dayjs(date2).format('DD/MM/YY HH:mm');
    }
}