export const getDownloadDate = () => {
    const format = (arr, sep) => arr.map(
        num => String(num).padStart(2, '0')
    ).join(sep)

    const now = new Date()

    const date = format([
        now.getDate(), now.getMonth() + 1, now.getFullYear(),
    ], "-")

    const stamp = format([
        now.getHours(), now.getMinutes()
    ], "-");

    return `(${date + "_" + stamp})`;
};


export const getDownloadTypeName = (isDerived, isArchive) => {
    const types = [
        isDerived ? 'производный долг' : '47 ст. НК РФ'
    ];
    if (isArchive) types.push('архив');

    return `(${types.join(', ')})`;
};
