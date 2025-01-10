import { ApiRequest } from "@app/lib/axios"
import { ILocation } from "@app/types/location";
export default class LocationsApi {
    static all = () => ApiRequest.get("/locations").then(res => res.data.result as Array<ILocation>);
    static scout = () => ApiRequest.get("/locations/scout").then(res => res.data.result as Array<ILocation>);
    static paginate = ({ page, limit }: { page: number, limit: number }, filter: { name: string }) => ApiRequest.post(`/locations/paginate?page=${page}&limit=${limit}`, { filter },).then(res => res.data.result as {
        pages: number,
        page: number,
        count: number,
        records: Array<ILocation>
    });
    static create = (data: { name: string }) => ApiRequest.post("/locations", data).then(res => res.data.result as ILocation);
    static update = (id: string, data: { name: string }) => ApiRequest.put(`/locations/${id}`, data).then(res => res.data.result as ILocation);
    static delete = (id: string) => ApiRequest.delete(`/locations/${id}`).then(res => res.data.message as string);
}
