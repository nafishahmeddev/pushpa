export type IInvoice = {
    id: string,
    receiptNo:number,
    amount: number,
    tax: number,
    items?: Array<IInvoiceItem>
    createdAt: Date,
    updatedAt: Date,
}


export type IInvoiceItem = {
    id: string,
    name: string,
    quantity: number,
    price: number,
    amount: number,
    tax: number,
}
