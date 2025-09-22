export function formatNumber(number, { defaultValue=undefined } = {}) {
  let value = number ? number : defaultValue;
  if (!value && (typeof value !== 'number') && (typeof value !== 'string'))
    return value;
  if (typeof value === "string")
    value = parseFloat(value)
  return value.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}


export function parseNumber(number) {
  if (typeof number === 'number') return number;
  const strNumbers = number.replace(/,/g, ".").replace(/\s*|\t|\r|\n/gm, "")
  return parseFloat(strNumbers)
}


export function parseDate(date) {
  return (date) ? date.toLocaleDateString('en-CA') : date;
}


// Функция для отображения даты в формате DD.MM.YYYY
export function formatDate(date) {
  if (!date) return '';
  const dateFormat = new Date(date);
  const day = String(dateFormat.getDate()).padStart(2, '0');
  const month = String(dateFormat.getMonth() + 1).padStart(2, '0');
  const year = dateFormat.getFullYear();
  return `${day}.${month}.${year}`;
}

// Функция для передачи даты в формате YYYY-MM-DD
export function formatDateForInput(date) {
  if (!date) return '';
  const dateFormat = new Date(date);
  const year = dateFormat.getFullYear();
  const month = String(dateFormat.getMonth() + 1).padStart(2, '0');
  const day = String(dateFormat.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}




export function transformDateForInput(date) {
  if (!date) return undefined
  const dateFormat = new Date(date)
  const [day, month, year] = dateFormat.toLocaleDateString().split('.')
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}