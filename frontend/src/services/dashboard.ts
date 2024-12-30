import { ApiRequest } from "@app/lib/axios"
export default class DashboardApi {
    static stats = () => ApiRequest.post(`/dashboard/stats`).then(res => res.data.result as {
        sales: number,
        invoices: number
    });
}
