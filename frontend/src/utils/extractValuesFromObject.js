export function extractValuesFromObject(obj, fields) {
    const extract = (current, key) => {
        return current && current[key] ? current[key] : null;
    };
    return fields.split('.').reduce(extract, obj);
}