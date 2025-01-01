import { ApiRequest } from "@app/lib/axios"
export default class DashboardApi {
    static stats = () => ApiRequest.post(`/dashboard/stats`).then(res => res.data.result as {
        tax: number,
        netSales: number,
        revenue: number,
        averageOrder: number,
        orders: number
        topSellingItems: Array<{
            name: string,
            count: number
        }>
    });
}
