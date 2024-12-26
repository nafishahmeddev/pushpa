export type IOrder = {
    id: string,
    receiptNo:number,
    amount: number,
    cgst: number,
    sgst: number,
    items?: Array<IOrderItem>
    createdAt: Date,
    updatedAt: Date,
}


export type IOrderItem = {
    id: string,
    name: string,
    quantity: number,
    price: number,
    amount: number,
    cgst: number,
    sgst: number,
}
