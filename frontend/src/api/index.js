import axios from "axios"



const instance = axios.create({
    baseURL: "http://127.0.0.1:3022/api-coordination/"
})


// API для управления авторизацией пользователя
export const userAPI = {
    loginUser: (login, password) => instance.post("/user/login", { login, password }),        // Авторизация с предоставлением информации о пользователе и JWT-токена
    verifyUser: token => instance.get("/user/verify", { headers: { authorization: token } })  // Верифекация пользователя - проверка валидности JWT-токена
}

// API для получения общей для нескольких страниц информации, такой как список регионов и категории должника
export const serviceAPI = {
    getRegions: (page) => instance.get(`/service/get-regions/${page}`),
    getDebtTypes: () => instance.get(`/service/get-debt-types`)
}

// API для получения информации, связанной с активыми
export const activesAPI = {
    getTables: (page, regionCode) => instance.get(`/actives/get-table/${page}/${regionCode}`),   // Таблицы для страниц "Взыскание по 47 ст.", и т.д.
    getActives: inn => instance.get(`/actives/get-actives/${inn}`)  // Активы для конкретного ИНН (для модалки)
}