import { ApiRequest } from "@app/lib/axios"
import { IOrder } from "@app/types/orders";
import { IInvoice } from "@app/types/invoice";
export default class OrdersApi {
    static all = () => ApiRequest.get("/orders").then(res => res.data.result as Array<IOrder>);
    static create = () => ApiRequest.post(`/orders/`).then(res => res.data.result as IOrder);
    static get = (cartId: string) => ApiRequest.get(`/orders/${cartId}`).then(res => res.data.result as IOrder);
    static updateItem = (cartId: string, data: { productId: string, quantity: number }) => ApiRequest.put(`/orders/${cartId}/items`, data).then(res => res.data.result as void);
    static addItem = (cartId: string, data: { productId: string, }) => ApiRequest.post(`/orders/${cartId}/items`, data).then(res => res.data.result as void);
    static delItem = (cartId: string, data: { productId: string, }) => ApiRequest.delete(`/orders/${cartId}/items`, { data: data }).then(res => res.data.result as void);
    static place = (cartId: string) => ApiRequest.get(`/orders/${cartId}/place`).then(res => res.data.result as IInvoice);
}
