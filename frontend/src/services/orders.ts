import { ApiRequest } from "@app/lib/axios"
import { IOrder } from "@app/types/orders";
import { IInvoice } from "@app/types/invoice";
import { ICart } from "@app/types/cart";
export default class OrdersApi {
    static drafts = () => ApiRequest.get("/orders/drafts").then(res => res.data.result as Array<IOrder>);
    static create = (data: ICart) => ApiRequest.post(`/orders/`, data).then(res => res.data.result as IOrder);
    static update = (orderId: string, data: ICart) => ApiRequest.put(`/orders/${orderId}`, data).then(res => res.data.result as IOrder);
    static get = (orderId: string) => ApiRequest.get(`/orders/${orderId}`).then(res => res.data.result as IOrder);
    static delete = (orderId: string) => ApiRequest.delete(`/orders/${orderId}`).then(res => res.data.message as string);
    static place = (data: {id?: string } & ICart) => ApiRequest.post(`/orders/place`, data).then(res => res.data.result as IInvoice);
}
