import { ApiRequest } from "@app/lib/axios"
import { IInvoice } from "@app/types/invoice";
export default class InvoicesApi {
    static paginate = ({ page, limit }: { page: number, limit: number }, filter: { [key: string]: unknown }, order: [field: string, sort: string]) => ApiRequest.post(`/invoices/paginate?page=${page}&limit=${limit}`, { filter, order },).then(res => res.data.result as {
        pages: number,
        page: number,
        count: number,
        records: Array<IInvoice>
    });
    static get = (invoiceId: string) => ApiRequest.get(`/invoices/${invoiceId}`).then(res => res.data.result as IInvoice);
}
