import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authSlice';
import cartReducer from './cartSlice'


const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth', 'cart']
};

const rootReducer = combineReducers({
    cart: cartReducer,
    auth: authReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        })
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);