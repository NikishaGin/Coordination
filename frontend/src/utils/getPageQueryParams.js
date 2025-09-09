import { store } from '../store/store.js';


// Для получения из store параметров для идентификации страницы,
// т.к. получение через хук в thunks недоступно.
export const getPageQueryParams = () => {
    const { pathname, isDerived, isArchived, selectedRegionIdByPage } = store.getState().main;
    return { isDerived, isArchived, regionId: selectedRegionIdByPage[pathname] };
}