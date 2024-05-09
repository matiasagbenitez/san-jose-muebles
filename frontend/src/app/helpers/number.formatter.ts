
export class NumberFormatter {
    constructor() { }

    /** 1234567.89 => 1.234.567,89 */
    static toDecimal(value: number): string {
        const num = new Intl.NumberFormat('es-AR', {
            style: 'decimal',
            minimumFractionDigits: 2
        }).format(value);

        return num;
    }

    /** 1234567.89 => + 1.234.567,89, -1234567.89 => - 1.234.567,89 */
    static toDecimalFullsigned(value: number): string {
        const num = new Intl.NumberFormat('es-AR', {
            style: 'decimal',
            minimumFractionDigits: 2
        }).format(value);

        return value < 0 ? `- ${num}` : `+ ${num}`;
    }

    /** 1234567.89 => $1.234.567,89 */
    static toDecimalMoney(value: number): string {
        const num = new Intl.NumberFormat('es-AR', {
            style: 'decimal',
            minimumFractionDigits: 2
        }).format(value);

        return `$${num}`;
    }

    /** 1234567.89 => + $1.234.567,89, -1234567.89 => - $1.234.567,89 */
    static toDecimalMoneyFullsigned(value: number): string {
        const num = new Intl.NumberFormat('es-AR', {
            style: 'decimal',
            minimumFractionDigits: 2
        }).format(value);

        return value < 0 ? `- $${num}` : `+ $${num}`;
    }

    /**
     * Example: formatSignedCurrency(true, 1234567.89) => + $1.234.567,89
     * @param is_monetary indicates if the value is monetary
     * @param value represents the number to format
     * @returns formatted string
     */
    static formatSignedCurrency(is_monetary: boolean = true, value: number): string {
        if (value == 0) { return `${is_monetary ? '$' : ''}0,00`; }
        const sign = value < 0 ? '- ' : '+ ';
        const num = new Intl.NumberFormat('es-AR', {
            style: 'decimal',
            minimumFractionDigits: 2
        }).format(Math.abs(value));

        return `${sign}${is_monetary ? '$' : ''}${num}`;
    }


}