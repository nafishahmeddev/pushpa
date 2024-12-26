import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ICategory, IProduct } from '../../types/product'

export interface IGetMenu {
    message: string,
    result: Array<ICategory & {
        products: Array<IProduct>
    }>,
}
export const menuApi = createApi({
    reducerPath: 'menu-api',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL+'/menu' }),
    endpoints: (builder) => ({
        getMenu: builder.query<IGetMenu, string>({
            query: () => ``,
        }),
    }),
})
export const MenuApiReducer = menuApi.reducer;
export const { useGetMenuQuery } = menuApi
