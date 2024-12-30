import { ApiRequest } from "@app/lib/axios"
import { IOrder } from "@app/types/orders";
import { IInvoice } from "@app/types/invoice";
export default class OrdersApi {
    static all = () => ApiRequest.get("/orders").then(res => res.data.result as Array<IOrder>);
    static drafts = () => ApiRequest.get("/orders/drafts").then(res => res.data.result as Array<IOrder>);
    static create = () => ApiRequest.post(`/orders/`).then(res => res.data.result as IOrder);
    static get = (orderId: string) => ApiRequest.get(`/orders/${orderId}`).then(res => res.data.result as IOrder);
    static updateItem = (orderId: string, data: { productId: string, quantity: number }) => ApiRequest.put(`/orders/${orderId}/items`, data).then(res => res.data.result as void);
    static addItem = (orderId: string, data: { productId: string, }) => ApiRequest.post(`/orders/${orderId}/items`, data).then(res => res.data.result as void);
    static delItem = (orderId: string, data: { productId: string, }) => ApiRequest.delete(`/orders/${orderId}/items`, { data: data }).then(res => res.data.result as void);
    static place = (orderId: string) => ApiRequest.get(`/orders/${orderId}/place`).then(res => res.data.result as IInvoice);
}
