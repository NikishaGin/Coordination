import axios from "axios"



const instance = axios.create({
    baseURL: "http://127.0.0.1:3022/api-coordination/"
})


export const serviceAPI = {
    getRegions: (page) => instance.get(`/service/get-regions/${page}`),
    getDebtTypes: () => instance.get(`/service/get-debt-types`)
}


export const activesAPI = {
    getTables: (page, regionCode) => instance.get(`/actives/get-table/${page}/${regionCode}`),
    getActives: inn => instance.get(`/actives/get-actives/${inn}`)
}  