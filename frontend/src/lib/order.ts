import { IOrderItem } from "@app/types/orders";

export default class OrderUtil {
    items: Array<IOrderItem> = []
    constructor(items: Array<IOrderItem>) {
        this.items = items;
    }
    get total() {
        return this.items.reduce((total, item) => {
            return total + (item.quantity * item.product.price);
        }, 0)
    }

    basePrice(item: IOrderItem) {
        const amount = item.product.price / (1 + (item.product.sgst + item.product.cgst) / 100);
        return amount;
    }


    get cgst() {
        let tax = 0;
        for (const item of this.items) {
            const amount = this.basePrice(item);
            tax += (amount * item.product.cgst / 100) * item.quantity
        }
        return tax;
    }

    get sgst() {
        let tax = 0;
        for (const item of this.items) {
            const amount = this.basePrice(item);
            tax += (amount * item.product.sgst / 100) * item.quantity
        }
        return tax;
    }

    get tax() {
        let tax = 0;
        for (const item of this.items) {
            const amount = this.basePrice(item);
            tax += (amount * item.product.sgst / 100) * item.quantity;
            tax += (amount * item.product.sgst / 100) * item.quantity;
        }
        return tax;
    }
}