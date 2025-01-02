import { ApiRequest } from "@app/lib/axios"
import { IOrder } from "@app/types/orders";
import { IInvoice } from "@app/types/invoice";
import { ICartItem } from "@app/types/cart";
export default class OrdersApi {
    static pendingList = () => ApiRequest.get("/orders/pending-list").then(res => res.data.result as Array<IOrder>);
    static getOrder = (orderId: string) => ApiRequest.get(`/orders/${orderId}`).then(res => res.data.result as IOrder);
    static newOrder = () => ApiRequest.post(`/orders/`).then(res => res.data.result as IOrder);
    static deleteOrder = (orderId: string) => ApiRequest.delete(`/orders/${orderId}`).then(res => res.data.message as string);
    static completeOrder = (orderId: string) => ApiRequest.post(`/orders/${orderId}/complete`).then(res => res.data.result as IInvoice);
    
    static modifyItem = (orderId: string, cartItem: ICartItem) => ApiRequest.post(`/orders/${orderId}/items`, { item: cartItem }).then(res => res.data.result as IOrder);
    static deleteItem = (orderId: string, productId: string) => ApiRequest.delete(`/orders/${orderId}/items`, { data: { productId } }).then(res => res.data.result as IOrder);
    static cancelItem = (orderId: string, productId: string) => ApiRequest.patch(`/orders/${orderId}/items/cancel`, { productId }).then(res => res.data.result as IOrder);

}
