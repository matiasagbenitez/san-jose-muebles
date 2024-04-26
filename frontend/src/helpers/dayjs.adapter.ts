import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';

export class DayJsAdapter {
    constructor() { }

    static toDayMonthYear(date: Date): string {
        return dayjs(date).format('DD/MM/YYYY');
    }

    static toDayMonthYearHour(date: Date): string {
        return dayjs(date).format('DD/MM/YYYY HH:mm');
    }

    static toDayMonthString(date: Date): string {
        dayjs.extend(updateLocale);
        dayjs.updateLocale('en', {
            months: [
                'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
            ]
        });
        return dayjs(date, 'DD-MMM').format('DD [de] MMMM');
    }

    static toDateString(date: Date): string {
        const new_date = new Date(date);
        const formatted = new_date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        return formatted;
    }

    static toDateYearString(date: Date): string {
        const new_date = new Date(date);
        const formatted = new_date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        return formatted;
    }

    static toDatetimeString(date: Date): string {
        const new_date = new Date(date);
        const formatted = new_date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        });
        return formatted;
    }

    static toMonthYearString(date: Date): string {
        const new_date = new Date(date);
        const formatted = new_date.toLocaleDateString('es-ES', {
            month: 'long',
            year: 'numeric',
        });
        return formatted;
    }

}