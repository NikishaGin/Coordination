import axios from "axios";
import { store } from "./store.js";



const instance = axios.create({
    baseURL: "http://127.0.0.1:3033/api/"
})

// Добавление JWT-токена в заголовок каждого запроса
instance.interceptors.request.use(config => {
    const state = store.getState()
    const token = state.user?.token
    if (token)
        config.headers.Authorization = `Bearer ${token}`
    return config
})


export const AuthAPI = {
    login: (data) => instance.post('auth/login', { params: data }),
    toggleServiceMode: () => instance.post('auth/toggle-service-mode'),
}

export const MainAPI = {
    getRegions: (data) => instance.get('main/regions', { params: data }),
    getClientCategories: (data) => instance.get('main/categories', { params: data }),
    getStatusesIP: (data) => instance.get('main/statuses-ip', { params: data }),
    getClients: (data, signal) => instance.get('main/clients', { params: data, signal }),
}

export const ClientAPI = {
    getResolutions: () => instance.get('clients/resolutions'),
    getInteractions: () => instance.get('clients/interactions'),
    createInteraction: () => instance.post('clients/interaction'),
    updateInteraction: () => instance.patch('clients/interaction'),
}

export const ActiveAPI = {
    getActivesStatistics: (clientId) => instance.get(`actives/${clientId}/statistics`),
    getActives: (clientId, typeActive) => instance.get(`actives/${clientId}/${typeActive}`),
    createActive: (clientId, data) => instance.post(`actives/${clientId}`, data),
    updateActive: (clientId, data) => instance.patch(`actives/${clientId}`, data),
}

export const DownloadAPI = {
    getCommonStatistics: () => instance.get(''),
    getResolutionsStatistics: () => instance.get(''),
    getActivesStatistics: () => instance.get(''),
}

export const LibraryAPI = {
    getDocuments: (type) => instance.get(),
    saveDocument: (type, data) => instance.post(),
}