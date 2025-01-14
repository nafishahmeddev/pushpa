import { ApiRequest } from "@app/lib/axios"
import { IKot, IOrder } from "@app/types/orders";
import { IInvoice } from "@app/types/invoice";
import { ICartItem } from "@app/types/cart";
import { SortType } from "@app/components/ui/DataTable";
export default class OrdersApi {
    static paginate = ({ page, limit }: { page: number, limit: number }, filter: { [key: string]: unknown }, order: [key: keyof IOrder, order: SortType]) => ApiRequest.post(`/orders/paginate?page=${page}&limit=${limit}`, { filter, order },).then(res => res.data.result as {
        pages: number,
        page: number,
        count: number,
        records: Array<IOrder>
    });
    static pendingList = () => ApiRequest.get("/orders/pending-list").then(res => res.data.result as Array<IOrder>);
    static getOrder = (orderId: string) => ApiRequest.get(`/orders/${orderId}`).then(res => res.data.result as IOrder);
    static createOrder = (data: Partial<IOrder>) => ApiRequest.post(`/orders/`, data).then(res => res.data.result as IOrder);
    static backEntryOrder = (data: {
        tableId?: string;
        type: string;
        createdAt: string;
        items: Array<ICartItem>;
    }) => ApiRequest.post(`/orders/back-entry`, data).then(res => res.data.result as IOrder);
    static updateOrder = (orderId: string, data: Partial<IOrder>) => ApiRequest.put(`/orders/${orderId}`, data).then(res => res.data.result as IOrder);
    static deleteOrder = (orderId: string) => ApiRequest.delete(`/orders/${orderId}`).then(res => res.data.message as string);
    static createKot = (orderId: string) => ApiRequest.post(`/orders/${orderId}/kot-create`).then(res => res.data.result as IKot);
    static cancelOrder = (orderId: string,) => ApiRequest.post(`/orders/${orderId}/cancel`).then(res => res.data.result as IInvoice);
    static completeOrder = (orderId: string,) => ApiRequest.post(`/orders/${orderId}/complete`).then(res => res.data.result as {
        invoice: IInvoice,
        kot?: IKot
    });

    static modifyItem = (orderId: string, cartItem: ICartItem) => ApiRequest.post(`/orders/${orderId}/items`, { item: cartItem }).then(res => res.data.result as IOrder);
    static deleteItem = (orderId: string, productId: string) => ApiRequest.delete(`/orders/${orderId}/items`, { data: { productId } }).then(res => res.data.result as IOrder);
    static cancelItem = (orderId: string, orderItemId: string) => ApiRequest.patch(`/orders/${orderId}/items/cancel`, { orderItemId }).then(res => res.data.result as IOrder);

}
