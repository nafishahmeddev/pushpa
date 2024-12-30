import Formatter from "@app/lib/formatter";
import { IInvoice } from "@app/types/invoice";
import moment from "moment";
import React from "react";
import Barcode from "react-barcode";
type OrderReceiptProps = {
  invoice: IInvoice;
};
export function OrderReceipt({ invoice }: OrderReceiptProps) {
  return (
    <div className="flex flex-col gap-3 p-6">
      <div className="text-center">
        <h3 className="font-bold italic">PUSHPA DHABA</h3>
        <p className="text-xs">Palsanda, Murshidabad, West Bengal</p>
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
              {Formatter.money((invoice.amount -( invoice.cgst + invoice.sgst)))}
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
      <div className="text-center text-xs py-3">
        <span className="border border-black px-2 inline-flex rounded-full">
          ☺ Thank you visit again!
        </span>
      </div>
      <div className="w-60 m-auto">
        <Barcode
          value={invoice.id}
          width={1}
          height={45}
          renderer="img"
          fontSize={15}
          margin={0}
        />
      </div>
    </div>
  );
}
