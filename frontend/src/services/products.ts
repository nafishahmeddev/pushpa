import { ApiRequest } from "@app/lib/axios"
import { IProduct } from "@app/types/product";
export default class ProductsApi {
    static all = () => ApiRequest.get("/products").then(res => res.data.result as Array<IProduct>);
    static paginate = ({ page, limit }: { page: number, limit: number }, filter: { [key: string]: unknown }) => ApiRequest.post(`/products/paginate?page=${page}&limit=${limit}`, { filter },).then(res => res.data.result as {
        pages: number,
        page: number,
        records: Array<IProduct>
    });
    static create = (data: { name: string }) => ApiRequest.post("/products", data).then(res => res.data.result as IProduct);
    static update = (id: string, data: { name: string }) => ApiRequest.put(`/products/${id}`, data).then(res => res.data.result as IProduct);
    static delete = (id: string) => ApiRequest.delete(`/products/${id}`).then(res => res.data.message as string);
}
