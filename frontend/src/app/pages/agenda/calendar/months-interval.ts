export const getMonthsInterval = (date: Date): { from_date: Date, to_date: Date } => {
    const inf_limit = new Date(date.getFullYear(), date.getMonth() - 1, 24);
    const sup_limit = new Date(date.getFullYear(), date.getMonth() + 1, 5, 24, 59, 59);

    return {
        from_date: inf_limit,
        to_date: sup_limit,
    }
}

