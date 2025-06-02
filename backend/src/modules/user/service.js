import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import {SECRET_KEY} from "../../config.js"



// Время сессии (7 дней)
const EXPIRES_IN = "7d"


// Преобразование существующих хэш паролей из БД, сгенерированных в PHP, в Bcrypt-хэш
function phpToBcryptHash(hash) {
    return hash.replace(/^\$2y\$/, "$2a$")
}


// Проверка пароля
export function isPasswordValid(password, passwordHash) {
    return bcrypt.compareSync(password, phpToBcryptHash(passwordHash))
}


// Декодирование информации из JWT-токена
export function decodeToken(token) {
    try {
        const payload = jwt.verify(token, SECRET_KEY)
        return { isValid: true, payload }
    } catch(error) {
        return { isValid: false }
    }
}


// Генерация JWT-токена из общей информации и секретного ключа
export function generateToken(data) {
    return jwt.sign(data, SECRET_KEY, {expiresIn: EXPIRES_IN})
}