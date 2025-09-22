export function getValueFromMap(key: any, map: { [key: string]: string }): string {
    return (key !== null) && map[key] ? map[key] : '';
}