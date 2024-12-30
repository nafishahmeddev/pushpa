import Formatter from "@app/lib/formatter";
import { IInvoice } from "@app/types/invoice";
import moment from "moment";
import React from "react";
import { Icon } from "@iconify/react";
import Dialog from "../ui/Dialog";
import { useAppSelector } from "@app/store";
import { AuthStateLoggedIn } from "@app/store/slices/auth";
type OrderReceiptDialogOpenProps = {
  open: true;
  invoice: IInvoice;
  onClose?: () => void;
};
type OrderReceiptDialogCloseProps = {
  open: boolean;
  invoice?: IInvoice;
  onClose?: () => void;
};
export type OrderReceiptDialogProps =
  | OrderReceiptDialogOpenProps
  | OrderReceiptDialogCloseProps;
export function OrderReceiptDialog({
  invoice,
  open,
  onClose,
}: OrderReceiptDialogProps) {
  const auth = useAppSelector(state=>state.auth as AuthStateLoggedIn);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      paperProps={{
        className: "!max-w-[350px]",
      }}
    >
      <div className="p-6">
        <button
          onClick={onClose && onClose}
          className="h-7 aspect-square rounded-2xl border absolute top-3 right-3 text-gray-500 flex items-center justify-center"
        >
          <Icon icon="ic:round-close" height={20} width={20} />
        </button>
        {invoice && (
          <React.Fragment>
            <div className="text-center">
              <h3 className="font-bold italic">{auth.user.restaurant?.name}</h3>
              <p className="text-xs">{auth.user.restaurant?.address}</p>
            </div>
            <div className="flex justify-between text-xs pt-3 pb-2  font-bold">
              <span>Receipt No: #{invoice.receiptNo}</span>
              <span>Date: {moment(invoice.createdAt).format("DD/MM/YYYY")}</span>
            </div>
            <div>
              <table className="text-xs w-full">
                <thead>
                  <tr className="border-t border-b border-dashed border-black">
                    <th className="px-1 py-1.5 ps-0 text-start">Description</th>
                    <th className="px-1 py-1.5 text-end">Price</th>
                    <th className="px-1 py-1.5">Qtd.</th>
                    <th className="px-1 py-1.5 pe-0 text-end ">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-1"></td>
                  </tr>
                  {(invoice.items ?? []).map((item) => (
                    <React.Fragment key={`invoice-item-${item.id}`}>
                      <tr>
                        <td className="px-1 py-1 ps-0">{item.name}</td>
                        <td className="px-1 py-1 text-end">
                          {Formatter.money(item.price)}
                        </td>
                        <td className="px-1 py-1">{item.quantity}</td>
                        <td className="px-1 py-1 pe-0 text-end">
                          {Formatter.money(item.amount)}
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
              <div className="border-t border-dashed border-black my-3"></div>
              <table className=" w-full text-xs font-bold">
                <tr>
                  <td>Subtotal(excl. Tax):</td>
                  <td className="text-end">
                    {Formatter.money(invoice.amount - (invoice.cgst + invoice.sgst))}
                  </td>
                </tr>

                <tr>
                  <td>Tax:</td>
                  <td className="text-end">
                    {Formatter.money(invoice.cgst + invoice.sgst)}
                  </td>
                </tr>

                <tr>
                  <td>Total:</td>
                  <td className="text-end">{Formatter.money(invoice.amount)}</td>
                </tr>
              </table>
            </div>
          </React.Fragment>
        )}
      </div>
    </Dialog>
  );
}
