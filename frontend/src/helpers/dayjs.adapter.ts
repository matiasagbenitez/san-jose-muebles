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

}