
export function sortStringArray(array: string[]) {
    return array.sort((a, b) => a.localeCompare(b))
}