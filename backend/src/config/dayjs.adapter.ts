import dayjs from 'dayjs';

export class DayJsAdapter {
    constructor() { }

    static toDayMonthYear(date: Date): string {
        return dayjs(date).format('DD/MM/YY');
    }

    static toDayMonthYearHour(date: Date): string {
        return dayjs(date).format('DD/MM/YY HH:mm');
    }

}