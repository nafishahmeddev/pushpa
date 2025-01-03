import { IInvoice } from "./invoice";
import { IProduct } from "./product";
import { IRestaurant } from "./restaurant";
import { ITable } from "./table";
import { IUser } from "./user";


export enum OrderStatus {
    Draft = "Draft",
    Ongoing = "Ongoing",
    Cancelled = "Cancelled",
    Paid = "Paid",
    Completed = "Completed"
}

export enum OrderType {
    Takeaway = "Takeaway",
    DineIn = "Dine-In",
}


export enum OrderItemStatus {
    Preparing = "Preparing",
    Prepared = "Prepared",
    Delivered = "Delivered",
    Cancelled = "Cancelled"
}
export type IOrder = {
    id: string,
    orderNo: number,
    status: OrderStatus,
    restaurantId: string;
    restaurant?: unknown;
    userId: string;
    user?: IUser,
    tableId?: string,
    table?: ITable,
    invoiceId?:string,
    invoice?:IInvoice,
    type: OrderType,
    items?: Array<IOrderItem>,
    kotList?: Array<IKot>,
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
    status: OrderItemStatus,
    createdAt: Date,
    updatedAt: Date
}
