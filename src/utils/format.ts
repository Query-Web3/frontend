export function numberFormat(num: number|null|undefined, decimals: number = 2): string {
    if (num === null || num === undefined || isNaN(num)) {
        return "-";
    }
    return num.toFixed(decimals);
}