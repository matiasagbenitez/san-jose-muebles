export const toMoney = (value: number) => {
    const num = new Intl.NumberFormat('es-AR', {
        style: 'decimal',
        minimumFractionDigits: 2
    }).format(value);

    return num;
}