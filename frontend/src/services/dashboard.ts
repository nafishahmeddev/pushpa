import { ApiRequest } from "@app/lib/axios"
import { TimeFrame } from "@app/types/enums";
export default class DashboardApi {
    static stats = (data: {timeFrame: TimeFrame}) => ApiRequest.post(`/dashboard/stats`, data).then(res => res.data.result as {
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
