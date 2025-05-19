import { PAGES } from "../types.js"


export const isDerivedDebt = page => 
    [PAGES.DerivativeDebt, PAGES.DerivativeDebtArchive].includes(page)


export const isArchive = page =>
    [PAGES.IndexArchive, PAGES.DerivativeDebtArchive].includes(page)


// Навпряляет необработанные ошибки в next
export const errWrap = wraped => (req, res, next) =>
    Promise.resolve(wraped(req, res, next)).catch(next)
