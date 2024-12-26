import { IProduct } from "./product";

export type ICart = {
    id: string,
    name: string,
    restaurantId: string;
    restaurant?: unknown;
    items?: Array<ICartItem>,
    createdAt: Date,
    updatedAt: Date,
}


export type ICartItem = {
    id: string,
    productId: string,
    product: IProduct,
    quantity: number,
    price: number,
}
