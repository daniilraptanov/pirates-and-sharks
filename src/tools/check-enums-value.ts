export const isValueInEnum = (numbers: Record<number, string>, value: number) => {
    return !!numbers[value];
}
