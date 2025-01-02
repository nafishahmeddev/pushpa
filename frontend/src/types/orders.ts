import { IProduct } from "./product";
import { IRestaurant } from "./restaurant";
import { ITable } from "./table";

export type IOrder = {
    id: string,
    seq: number,
    restaurantId: string;
    restaurant?: unknown;
    tableId?: string,
    table?: ITable,
    deliveryType: string,
    items?: Array<IOrderItem>,
    createdAt: Date,
    updatedAt: Date,
}

export type IKot = {
    id: string,
    restaurantId: string;
    restaurant?: IRestaurant;
    orderId: string;
    order?: IOrder;
    tokenNo: number,
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
