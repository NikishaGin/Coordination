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
    getInfo: inn => instance.get(`/actives/get-info/${inn}`),
    getResolutions: inn => instance.get(`/actives/get-info/${inn}/resolutions`),
    getActivesStatistics: inn => instance.get(`/actives/get-info/${inn}/actives-statistics`),
    getDebt: inn => instance.get(`/actives/get-info/${inn}/debt`),
    getActives: (inn, nameActive) => instance.get(`/actives/get-actives/${inn}/${nameActive}`),
}


export const downloadAPI = {
    getStatistics: (isDerived, regionCode, innList) => instance.get("/download/get-statistics", { params: { isDerived, regionCode, innList }, responseType: 'blob' }),
    getStatisticsIP: (isDerived, regionCode, innList) => instance.get("/download/get-statistics-IP", { params: { isDerived, regionCode, innList }, responseType: 'blob' })
}


