import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer, { clearUser } from "./user/userSlice.js";
import mainReducer, { resetGlobal } from "./main/mainSlice.js";
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
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store)

export default function resetStore() {
    store.dispatch(resetGlobal());
    store.dispatch(clearUser());
}