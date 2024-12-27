import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import { MenuApiReducer, menuApi } from './store/services/menu'
import { AuthReducer } from './store/slices/auth'

export const store = configureStore({
    reducer: {
        auth: AuthReducer,
        [menuApi.reducerPath]: MenuApiReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
        .concat(menuApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()