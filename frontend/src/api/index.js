import axios from "axios"



const instance = axios.create({
    baseURL: "http://127.0.0.1:3022/api-coordination/"
})


export const serviceAPI = {
    getRegions: (page) => instance.get(`/service/det-regions/${page}`),
    getRegionName: (regionCode) => instance.get(`/service/get-region-name/${regionCode}`),
    getDebtTypes: () => instance.get(`/service/get-debt-types`)
}


export const activesAPI = {
    getTables: (page, regionCode) => instance.get(`/actives/get-table/${page}/${regionCode}`)
}  