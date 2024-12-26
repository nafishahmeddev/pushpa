import { configureStore } from '@reduxjs/toolkit'
import { CounterReducer } from './store/slices/counter'
import { useDispatch, useSelector } from 'react-redux'
import { MenuApiReducer, menuApi } from './store/services/menu'

export const store = configureStore({
    reducer: {
        counter: CounterReducer,
        [menuApi.reducerPath]: MenuApiReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
        .concat(menuApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()