import { decodeToken } from './modules/user/service.js';


/**
 * TODO: Надо наладить инфраструктуру обработчиков ошибок.
 */

// ! НЕ убирать _
export const rootErrorHandler = (err, req, res, _) => {
    if (res.headersSent) return

    console.error(err)
    res.status(500).json({ message: "Internal Server Error" })
}


const authenticateOrSendError = (req, res, next) => {
    const token = req.headers.authorization
    const { isValid, payload } = decodeToken(token)
    console.log(isValid, payload)

    const errMessage = "Authentication faild"

    if (!isValid) {
        res.status(401).json({ details: errMessage })
        next(new Error(errMessage))
    }

    return { isValid, payload }
}


/**
 * Мидлварь для проверки авторизации,
 * отвечает ошибкой, если пользователь не авторизован.
 */
export const checkAuthMiddleware = (req, res, next) => {
    authenticateOrSendError(req, res, next)
    next()
}


/**
 * Мидлварь для проверки авторизации и получения данных пользователя.
 * Проверяет авторизацию и расширяет объект req объектом user
 * с данными пользователя.
 */
export const getUserMiddleware = async (req, res, next) => {
    const { isValid, payload } = authenticateOrSendError(req, res, next)
    if (!isValid) return

    if (!payload) {
        res.status(404).json({details: "User not found"})
    }

    req.userInfo = payload
    next()
}