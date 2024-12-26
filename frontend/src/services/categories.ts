import { ApiRequest } from "@app/lib/axios"
import { ICategory } from "@app/types/product";
export default class CategoriesApi {
    static all = () => ApiRequest.get("/categories").then(res => res.data.result as Array<ICategory>);
    static create = (data: { name: string }) => ApiRequest.put("/categories", data).then(res => res.data.result as ICategory);
    static update = (id: string, data: { name: string }) => ApiRequest.put(`/categories/${id}`, data).then(res => res.data.result as ICategory);
    static delete = (id: string) => ApiRequest.delete(`/categories/${id}`).then(res => res.data.message as string);
}
