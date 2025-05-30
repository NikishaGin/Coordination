import { PAGES } from "../types.js"


export const isDerivedDebt = page => +[PAGES.DerivativeDebt, PAGES.DerivativeDebtArchive].includes(page)


export const isArchive = page => +[PAGES.IndexArchive, PAGES.DerivativeDebtArchive].includes(page)