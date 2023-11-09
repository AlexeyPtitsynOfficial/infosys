import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import userReducer from './features/users/usersSlice';

import { apiSlice } from "./features/api/apiSlice";

export const store = configureStore({
    reducer:{
        [apiSlice.reducerPath] : apiSlice.reducer,
        auth: authReducer,
        users: userReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch