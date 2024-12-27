import { createApi } from '@reduxjs/toolkit/query/react'
import { ICategory, IProduct } from '../../types/product'
import MenuApi from '@app/services/menu';

export interface IGetMenu {
    message: string,
    result: Array<ICategory & {
        products: Array<IProduct>
    }>,
}
export const menuApi = createApi({
    reducerPath: 'menu-api',
    baseQuery: MenuApi.menu,
    endpoints: (builder) => ({
        getMenu: builder.query<IGetMenu, string>({
            query: () => ``,
        }),
    }),
})
export const MenuApiReducer = menuApi.reducer;
export const { useGetMenuQuery } = menuApi
