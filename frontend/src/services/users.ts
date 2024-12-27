import { ApiRequest } from "@app/lib/axios"
import { IUser } from "@app/types/user";
export default class UsersApi {
    static paginate = ({ page, limit }: { page: number, limit: number }, filter: { [key: string]: unknown }) => ApiRequest.post(`/users/paginate?page=${page}&limit=${limit}`, { filter },).then(res => res.data.result as {
        pages: number,
        page: number,
        records: Array<IUser>
    });
    static create = (data: { name: string }) => ApiRequest.post("/users", data).then(res => res.data.result as IUser);
    static update = (id: string, data: { name: string }) => ApiRequest.put(`/users/${id}`, data).then(res => res.data.result as IUser);
    static delete = (id: string) => ApiRequest.delete(`/users/${id}`).then(res => res.data.message as string);
}
