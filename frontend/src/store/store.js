import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
    persistStore,
    persistReducer,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { setupRequestInterceptor, setupResponseInterceptor } from "./API.js";
import userReducer, { clearUser, updateServiceMode } from "./user/userSlice.js";
import mainReducer, { clearMain } from "./main/mainSlice.js";
import activesReducer from "./activesSlice";
import interactionsReducer from "./interactionsSlice";
import fileStorageReducer from "./fileStorageSlice";


const persistConfig = {
    key: 'root',
    storage,
    whitelist: ["user"]
}

const rootReducer = combineReducers({
    user: userReducer,
    main: mainReducer,
    actives: activesReducer,
    interactions: interactionsReducer,
    fileStorage: fileStorageReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Создаем хранилище
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        }),
});

export const persistor = persistStore(store)

export default function logout() {
    store.dispatch(clearMain());
    store.dispatch(clearUser());
}

setupRequestInterceptor(store);
setupResponseInterceptor(store, logout, updateServiceMode);