export enum InvoiceStatus {
    Paid = "Paid",
    Cancelled = "Cancelled"
}
export type IInvoice = {
    id: string,
    receiptNo: number,
    status: InvoiceStatus,
    amount: number,
    subTotal: number,
    tax: number,
    discount: number,
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
