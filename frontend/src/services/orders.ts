import { ApiRequest } from "@app/lib/axios"
import { IOrder } from "@app/types/order";
export default class OrdersApi {
    static paginate = ({ page, limit }: { page: number, limit: number }, filter: {[key: string]: unknown}) => ApiRequest.post(`/orders/paginate?page=${page}&limit=${limit}`, {filter},).then(res => res.data.result as {
        pages: number,
        page: number,
        records: Array<IOrder>
    });
    static get = (orderId: string) => ApiRequest.get(`/orders/${orderId}`).then(res => res.data.result as IOrder);
}
