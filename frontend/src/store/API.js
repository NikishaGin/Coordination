import axios from "axios";


const instance = axios.create({
    baseURL: "http://127.0.0.1:3033/api/"
});

// Добавление JWT-токена в заголовок каждого запроса
export const setupRequestInterceptor= (store) => {
    instance.interceptors.request.use(config => {
        const state = store.getState();
        const token = state.user?.token || "";
        if (token)
            config.headers.Authorization = `Bearer ${token}`;
        return config;
    });
}

// Перехват ошибок связанных с истечением срока действия JWT-токена и
// включением сервисного режима, а также обновление сервисного режима
export const setupResponseInterceptor = (store, logout, updateServiceMode) => {
    instance.interceptors.response.use(
        (response) => {
            /*
            console.log(response)
            const {serviceMode} = response; /////// !!!!!!!!!!!!
            store.dispatch(updateServiceMode(serviceMode));
             */
            return response;
        },
        (error) => {
            if (error.response) {
                const {status} = error.response;
                if ([401, 503].includes(status))
                    logout();
            }
            return Promise.reject(error);
        }
    );
}

export const AuthAPI = {
    login: (data) => instance.post('auth/login', data),
    toggleServiceMode: () => instance.post('auth/toggle-service-mode'),
}

export const MainAPI = {
    getRegions: (params) => instance.get('main/regions', { params }),
    getClientCategories: (params) => instance.get('main/categories', { params}),
    getStatusesIP: (params) => instance.get('main/statuses-ip', { params }),
    getClients: (params, signal) => instance.get('main/clients', { params, signal }),
}

export const ClientAPI = {
    getResolutions: (clientId, params) => instance.get(`clients/${clientId}/resolutions`, { params }),
    getInteractions: (clientId, params) => instance.get(`clients/${clientId}/interactions`, { params }),
    createInteraction: (clientId) => instance.post(`clients/${clientId}/interactions`),
    // Согласно REST, принято создавать URL всегда с ID основной сущности,
    // но можешь его не передавать (хотя принято - передавать), т.к. interactionId - уникален.
    updateInteraction: (clientId, interactionId, data) => instance.patch(`clients/${clientId}/interactions/${interactionId}`, data),
}

export const ActiveAPI = {
    getActivesStatistics: (clientId) => instance.get(`clients/${clientId}/actives/statistics`),
    getActives: (clientId, activeType) => instance.get(`clients/${clientId}/actives/${activeType}`),
    createActive: (clientId, data) => instance.post(`clients/${clientId}/actives/`, data),
    // Аналогично
    updateActive: (clientId, activeId, data) => instance.patch(`clients/${clientId}/actives/${activeId}`, data),
}

export const DownloadAPI = {
    getCommonStatistics: (params) => instance.get('download/common-statistics', { params, responseType: 'blob' }),
    getResolutionsStatistics: (params) => instance.get('download/resolutions-statistics', { params, responseType: 'blob' }),
    getActivesStatistics: (params) => instance.get('download/actives-statistics', { params, responseType: 'blob' }),
}

export const LibraryAPI = {
    getDocuments: (type) => instance.get(),
    saveDocument: (type, data) => instance.post(),
}