import axios from "axios"
import { store } from "../store/store.js"



const instance = axios.create({
    baseURL: "http://127.0.0.1:3022/api-coordination/"
})


// Добавление JWT-токена в заголовок каждого запроса
instance.interceptors.request.use(config => {
    const state = store.getState()
    const token = state.user?.token
    if (token)
        config.headers.Authorization = token
    return config
})



// API для управления авторизацией пользователя
export const userAPI = {
    loginUser: (login, password) => instance.post("/user/login", { login, password }), // Авторизация с предоставлением информации о пользователе и JWT-токена
    getServiceMode: () => instance.get(`/user/get-service-mode`),
    toggleServiceMode: () => instance.post(`/user/toggle-service-mode`)
}


// API для получения общей для нескольких страниц информации, такой как список регионов и категории должника
export const serviceAPI = {
    getRegions: (page) => instance.get(`/service/get-regions/${page}`),
    getTypesDebtorCategory: () => instance.get(`/service/get-types-debtor-category`),
}

// API для получения информации, связанной с активыми
export const activesAPI = {
    getTables: (page, regionCode) => instance.get(`/actives/get-table/${page}/${regionCode}`),   // Таблицы для страниц "Взыскание по 47 ст.", и т.д.
    getInfo: inn => instance.get(`/actives/get-info/${inn}`),
    getResolutions: inn => instance.get(`/actives/get-info/${inn}/resolutions`),
    getActivesStatistics: inn => instance.get(`/actives/get-info/${inn}/actives-statistics`),
    getDebt: inn => instance.get(`/actives/get-info/${inn}/debt`),
    getActives: (inn, nameActive) => instance.get(`/actives/get-actives/${inn}/${nameActive}`),
    createNewActives: (nameActive, inn, data) => instance.post(`/actives/create-new-actives/${nameActive}/${inn}`, data),
    updateActives: (nameActive, inn, data) => instance.patch(`/actives/update-actives/${nameActive}/${inn}`, data)
}


export const downloadAPI = {
    getStatistics: (innList, isDerived, isArchive) => instance.get("/download/get-statistics", { params: {innList, isDerived, isArchive}, responseType: 'blob' }),
    getStatisticsIP: (innList, isDerived, isArchive) => instance.get("/download/get-statistics-IP", { params: {innList, isDerived, isArchive}, responseType: 'blob' }),
    getDebtorActivesStat: (inn, isDerived, isArchive) => instance.get("/download/get-debtor-actives-stat", { params: {inn, isDerived, isArchive}, responseType: 'blob' }),
}


export const fileStorageAPI = {
    getDocuments: (source) => instance.get(`/file-storage/get-documents/${source}`),
    saveDocument: (source, formData) => instance.post(`/file-storage/save-document/${source}`, formData)
}


export const interactionAPI = {
    getInteractions: (source, inn) => instance.get(`/interactions/get-interactions/${source}/${inn}`),
    saveInteraction: (source, inn, type, formData) => instance.post(`/interactions/save-interaction/${source}/${inn}/${type}`, formData)
}