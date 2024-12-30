import { ApiRequest } from "@app/lib/axios"
import { IInvoice } from "@app/types/invoice";
export default class InvoicesApi {
    static paginate = ({ page, limit }: { page: number, limit: number }, filter: {[key: string]: unknown}) => ApiRequest.post(`/invoices/paginate?page=${page}&limit=${limit}`, {filter},).then(res => res.data.result as {
        pages: number,
        page: number,
        records: Array<IInvoice>
    });
    static get = (orderId: string) => ApiRequest.get(`/invoices/${orderId}`).then(res => res.data.result as IInvoice);
}
