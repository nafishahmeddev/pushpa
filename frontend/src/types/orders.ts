import { IProduct } from "./product";

export type IOrder = {
    id: string,
    restaurantId: string;
    restaurant?: unknown;
    items?: Array<IOrderItem>,
    createdAt: Date,
    updatedAt: Date,
}


export type IOrderItem = {
    id: string,
    productId: string,
    kotId?: string,
    product: IProduct,
    quantity: number,
    price: number,
}
