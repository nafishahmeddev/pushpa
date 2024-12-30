import { ApiRequest } from "@app/lib/axios"
import { ITable } from "@app/types/table";
export default class TablesApi {
    static all = () => ApiRequest.get("/tables").then(res => res.data.result as Array<ITable>);
    static paginate = ({ page, limit }: { page: number, limit: number }, filter: { name: string }) => ApiRequest.post(`/tables/paginate?page=${page}&limit=${limit}`, { filter },).then(res => res.data.result as {
        pages: number,
        page: number,
        records: Array<ITable>
    });
    static create = (data: { name: string, locationId: string }) => ApiRequest.post("/tables", data).then(res => res.data.result as ITable);
    static update = (id: string, data: { name: string }) => ApiRequest.put(`/tables/${id}`, data).then(res => res.data.result as ITable);
    static delete = (id: string) => ApiRequest.delete(`/tables/${id}`).then(res => res.data.message as string);
}
