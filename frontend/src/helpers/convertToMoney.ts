export const convertToMoney = (value: number) => {
    const numberFormat = new Intl.NumberFormat('es-AR', {
        style: 'decimal',
        minimumFractionDigits: 2
    });

    const formattedValue = numberFormat.format(value < 0 ? -value : value);
   
    let currencySign = '';
    switch (true) {
        case value < 0:
            currencySign = '- $';
            break;
        case value > 0:
            currencySign = '+ $';
            break;
        default:
            currencySign = '$';
            break;
    }

    return `${currencySign}${formattedValue}`;
};