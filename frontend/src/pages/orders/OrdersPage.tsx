import ScrollView from "@app/components/ScrollView";
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import Formatter from "@app/lib/formatter";
import OrdersApi from "@app/services/orders";
import { IOrder } from "@app/types/order";
import { useFormik } from "formik";
import Spinner from "@app/components/Spinner";
import {
  OrderReceiptDialog,
  OrderReceiptDialogProps,
} from "@app/components/order/OrderReceiptDialog";

export default function ProductsPage() {
  const form = useFormik({
    initialValues: {
      createdAt: ["", ""],
    },
    onSubmit: paginate,
  });
  const [query, setQuery] = useState({ page: 1, limit: 20 });
  const [result, setResult] = useState<{
    pages: number;
    page: number;
    records: Array<IOrder>;
  }>({
    pages: 1,
    page: 0,
    records: [],
  });
  const [oderDetailsDialog, setOderDetailsDialog] =
    useState<OrderReceiptDialogProps>({
      open: false,
    });

  function paginate(values: { [key: string]: unknown }) {
    return OrdersApi.paginate(
      { page: query.page, limit: query.limit },
      values
    ).then((res) => {
      setResult(res);
      setQuery({ page: res.page, limit: query.limit });
    });
  }

  const handleOnDetails = (orderId: string) => {
    OrdersApi.get(orderId).then((res) => {
      setOderDetailsDialog({ open: true, order: res });
    });
  };

  useEffect(() => {
    if (query.page != result.page) {
      form.submitForm();
    }
  }, [query]);
  return (
    <React.Fragment>
      <OrderReceiptDialog
        {...oderDetailsDialog}
        onClose={() => setOderDetailsDialog({ open: false })}
      />
      <div className="h-full bg-white p-4 grid grid-rows-[55px_1fr_35px] gap-6">
        <div className=" flex gap-4 items-center">
          <div className="flex-1 flex flex-col items-start justify-center">
            <h2 className="text-2xl">Orders</h2>
            <p>Showing Invoices for Today</p>
          </div>

          <form
            onSubmit={form.handleSubmit}
            onReset={form.handleReset}
            className="h-9"
          >
            <fieldset
              className="flex gap-3 h-full"
              disabled={form.isSubmitting}
            >
              <input
                className="border rounded-xl px-3"
                placeholder="Date from"
                type="date"
                {...form.getFieldProps("createdAt.0")}
              />
              <input
                className="border rounded-xl px-3"
                placeholder="Date to"
                type="date"
                {...form.getFieldProps("createdAt.1")}
              />
              <button className="rounded-xl px-3 bg-green-500 text-white hover:opacity-50">
                Search
              </button>
              <button
                className="rounded-xl px-3 bg-gray-300 hover:opacity-50"
                type="reset"
              >
                Reset
              </button>
            </fieldset>
          </form>
        </div>

        <ScrollView className={`h-full bg-white border rounded-xl relative`}>
          <table className="w-full text-sm">
            <thead>
              <tr className="sticky top-0 left-0 bg-gray-100 z-10">
                <td className="px-3 py-2 w-0">#</td>
                <td className="px-0 py-2 w-0" />
                <td className="px-3 py-2 text-nowrap">Receipt No</td>
                <td className="px-3 py-2 w-0">Date</td>
                <td className="px-3 py-2 w-0 text-end">CGST</td>
                <td className="px-3 py-2 w-0 text-end">SGST</td>
                <td className="px-3 py-2 w-0 text-end">Amount</td>
              </tr>
            </thead>
            <tbody>
              {result.records.map((order, index: number) => (
                <tr key={`product-${order.id}`}>
                  <td className="px-3 py-2">
                    {(query.page - 1) * query.limit + index + 1}
                  </td>
                  <td className="px-0 py-2 w-0 sticky left-0 bg-white">
                    <div className="inline-flex flex-nowrap gap-2 text-gray-600 px-2">
                     
                      <button className="hover:opacity-70 "     onClick={() => handleOnDetails(order.id)}>
                        <Icon
                          icon="akar-icons:receipt"
                          height={20}
                          width={20}
                        />
                      </button>
                    </div>
                  </td>
                  <td className="px-3 py-2 w-0">{order.receiptNo}</td>
                  <td className="px-3 py-2 w-0 text-nowrap">
                    {Formatter.datetime(order.createdAt)}
                  </td>
                  <td className="px-3 py-2 w-0 text-end">
                    {Formatter.money(order.cgst)}
                  </td>
                  <td className="px-3 py-2 w-0 text-end">
                    {Formatter.money(order.sgst)}
                  </td>
                  <td className="px-3 py-2 w-0 text-end">
                    {Formatter.money(order.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {form.isSubmitting && (
            <div className="absolute top-0 left-0 w-full h-full p-10 flex items-center justify-center bg-white/10 backdrop-blur-sm">
              <Spinner />
            </div>
          )}
        </ScrollView>
        <div className="flex items-center gap-2 h-[35px]">
          <button
            className={`border rounded-xl bg-white px-3 aspect-square h-full  flex items-center justify-center`}
            onClick={() => setQuery({ ...query, page: query.page - 1 })}
            disabled={query.page <= 1}
          >
            <Icon icon="formkit:left" />
          </button>

          {Array.from({ length: result.pages }).map((_, index) => (
            <button
              key={`pagination-${index}`}
              className={`border rounded-xl bg-white px-3 aspect-square  h-full  flex items-center justify-center 
              ${
                index + 1 == query.page ? "bg-green-800/10 text-green-800" : ""
              }`}
              onClick={() => setQuery({ ...query, page: index + 1 })}
              disabled={index + 1 == query.page}
            >
              {index + 1}
            </button>
          ))}
          <button
            className={`border rounded-xl bg-white px-3 aspect-square h-full flex items-center justify-center`}
            onClick={() => setQuery({ ...query, page: query.page + 1 })}
            disabled={query.page >= result.pages}
          >
            <Icon icon="formkit:right" />
          </button>
        </div>
      </div>
    </React.Fragment>
  );
}
