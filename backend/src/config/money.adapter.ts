interface CurrencyInterface {
    id: number;
    name: string;
    symbol: string;
    is_monetary: boolean;
}

export class MoneyAdapter {
    constructor() { }

    static get(currency: CurrencyInterface, amount: number): string {

        const num = new Intl.NumberFormat('es-AR', {
            style: 'decimal',
            minimumFractionDigits: 2
        }).format(amount);

        const symbol = currency.symbol;
        const monetary = currency.is_monetary ? '$' : '';
        const formatted = `${symbol} ${monetary} ${num}`;

        return formatted;
    }
}