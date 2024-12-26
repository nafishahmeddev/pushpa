import { ApiRequest } from "@app/lib/axios"
import { ICart } from "@app/types/cart";
import { IOrder } from "@app/types/order";
export default class CartsApi {
    static all = () => ApiRequest.get("/carts").then(res => res.data.result as Array<ICart>);
    static create = () => ApiRequest.post(`/carts/`).then(res => res.data.result as ICart);
    static get = (cartId: string) => ApiRequest.get(`/carts/${cartId}`).then(res => res.data.result as ICart);
    static updateItem = (cartId: string, data: { productId: string, quantity: number }) => ApiRequest.put(`/carts/${cartId}/items`, data).then(res => res.data.result as void);
    static addItem = (cartId: string, data: { productId: string, }) => ApiRequest.post(`/carts/${cartId}/items`, data).then(res => res.data.result as void);
    static delItem = (cartId: string, data: { productId: string, }) => ApiRequest.delete(`/carts/${cartId}/items`, { data: data }).then(res => res.data.result as void);
    static place = (cartId: string) => ApiRequest.get(`/carts/${cartId}/place`).then(res => res.data.result as IOrder);
}
