import { ApiRequest } from "@app/lib/axios"
import { IKot, IOrder } from "@app/types/orders";
import { IInvoice } from "@app/types/invoice";
import { ICartItem } from "@app/types/cart";
export default class OrdersApi {
    static paginate = ({ page, limit }: { page: number, limit: number }, filter: {[key: string]: unknown}) => ApiRequest.post(`/orders/paginate?page=${page}&limit=${limit}`, {filter},).then(res => res.data.result as {
        pages: number,
        page: number,
        records: Array<IOrder>
    });
    static pendingList = () => ApiRequest.get("/orders/pending-list").then(res => res.data.result as Array<IOrder>);
    static getOrder = (orderId: string) => ApiRequest.get(`/orders/${orderId}`).then(res => res.data.result as IOrder);
    static createOrder = (data: { tableId?: string, type: string }) => ApiRequest.post(`/orders/`, data).then(res => res.data.result as IOrder);
    static updateOrder = (orderId:string,data: { tableId?: string, type: string }) => ApiRequest.put(`/orders/${orderId}`, data).then(res => res.data.result as IOrder);
    static deleteOrder = (orderId: string) => ApiRequest.delete(`/orders/${orderId}`).then(res => res.data.message as string);
    static createKot = (orderId: string) => ApiRequest.post(`/orders/${orderId}/kot-create`).then(res => res.data.result as IKot);
    static cancelOrder = (orderId: string,) => ApiRequest.post(`/orders/${orderId}/cancel`).then(res => res.data.result as IInvoice);
    static completeOrder = (orderId: string,) => ApiRequest.post(`/orders/${orderId}/complete`).then(res => res.data.result as IInvoice);

    static modifyItem = (orderId: string, cartItem: ICartItem) => ApiRequest.post(`/orders/${orderId}/items`, { item: cartItem }).then(res => res.data.result as IOrder);
    static deleteItem = (orderId: string, productId: string) => ApiRequest.delete(`/orders/${orderId}/items`, { data: { productId } }).then(res => res.data.result as IOrder);
    static cancelItem = (orderId: string, orderItemId: string) => ApiRequest.patch(`/orders/${orderId}/items/cancel`, { orderItemId }).then(res => res.data.result as IOrder);

}
