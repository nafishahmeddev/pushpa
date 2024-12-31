export type ICartItem = {
    productId: string,
    quantity: number,
    price: number,
};
export type ICart = {
    name: string,
    items: Array<ICartItem>,
}