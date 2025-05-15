export function formatNumber(number) {
  if (!number) return undefined
  if (typeof number === "string") number = parseFloat(number)
  return number.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}


export function parseNumber(number) {
  const strNumbers = number.replace(/,/g, ".").replace(/\s*|\t|\r|\n/gm, "")
  return parseFloat(strNumbers)
}


export function formatDate(date) {
  if (!date) return undefined
  const dateFormat = new Date(date)
  return dateFormat.toLocaleDateString()
}


export function transformDateForInput(date) {
  if (!date) return undefined
  const dateFormat = new Date(date)
  const [day, month, year] = dateFormat.toLocaleDateString().split('.')
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}