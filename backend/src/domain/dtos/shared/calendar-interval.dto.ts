export class CalendarIntervalDto {
    private constructor(
        public readonly from_date: Date,
        public readonly to_date: Date
    ) { }

    static create(object: { [key: string]: any }): [string?, CalendarIntervalDto?] {
        const { from_date, to_date } = object;

        if (!from_date) return ['from_date is required'];
        if (!to_date) return ['to_date is required'];

        return [undefined, new CalendarIntervalDto(from_date, to_date)];
    }
}