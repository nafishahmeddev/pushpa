import { IProduct } from "./product";

export type ICartItem = {
    productId: string,
    product: IProduct,
    quantity: number,
    price: number,
};
export type ICart = {
    name: string,
    items: Array<ICartItem>,
}