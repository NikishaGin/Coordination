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
import globalReducer, { resetGlobal } from "./globalSlice";
import userReducer, { resetUser } from "./userSlice";
import tableDataReducer from "./tableDataSlice.js";
import clientReducer from "./ClientSlice.js";
import fileStorageReducer from "./fileStorageSlice.js";


const persistConfig = {
    key: 'root',
    storage,
    whitelist: ["user"]
}

const rootReducer = combineReducers({
    global: globalReducer,
    user: userReducer,
    tableData: tableDataReducer,
    client: clientReducer,
    fileStorage: fileStorageReducer
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
    store.dispatch(resetUser());
}