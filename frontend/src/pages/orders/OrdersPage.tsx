import ScrollView from "@app/components/ui/ScrollView";
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import Formatter from "@app/lib/formatter";
import OrdersApi from "@app/services/orders";
import { IOrder } from "@app/types/order";
import { useFormik } from "formik";
import Spinner from "@app/components/ui/Spinner";
import {
  OrderReceiptDialog,
  OrderReceiptDialogProps,
} from "@app/components/order/OrderReceiptDialog";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@app/components/ui/table/Table";
import Pagination from "@app/components/ui/Pagination";
import Input from "@app/components/ui/form/input";

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
  const handleOnDetails = (orderId: string, print: boolean = false) => {
    const w = window.open(
      import.meta.env.VITE_BASE_URL +
        `/orders/${orderId}/receipt?authorization=${localStorage.getItem(
          "accessToken"
        )}`,
      "_blank",
      "location=yes,height=600,width=350,scrollbars=yes,status=yes"
    );

    if (w && print) {
      setTimeout(function () {
        w.document.close();
        w.focus();
        w.print();
        w.close();
      }, 1000);
    }
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
      <div className="h-full  p-4 grid grid-rows-[55px_1fr_35px] gap-6">
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
              <Input
                className="border rounded-xl px-3"
                placeholder="Date from"
                type="date"
                {...form.getFieldProps("createdAt.0")}
              />
              <Input
                className="border rounded-xl px-3"
                placeholder="Date to"
                type="date"
                {...form.getFieldProps("createdAt.1")}
              />
              <button className="rounded-xl px-3 bg-blue-500 text-white hover:opacity-50">
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

        <ScrollView className="h-full bg-white border rounded-xl overflow-hidden relative">
          <Table bordered>
            <TableHead>
              <TableRow className="sticky top-0 left-0 z-10" header>
                <TableCell>#</TableCell>
                <TableCell />
                <TableCell>Receipt No</TableCell>
                <TableCell>Date</TableCell>
                <TableCell className="text-end">CGST</TableCell>
                <TableCell className="text-end">SGST</TableCell>
                <TableCell className="text-end">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {result.records.map((order, index: number) => (
                <TableRow key={`product-${order.id}`}>
                  <TableCell className="px-3 py-2 w-0">
                    {(query.page - 1) * query.limit + index + 1}
                  </TableCell>
                  <TableCell className="px-0 py-2 w-0 sticky left-0 bg-white">
                    <div className="inline-flex flex-nowrap gap-2 text-gray-600 px-2">
                      <button
                        className={`hover:opacity-50`}
                        onClick={() => handleOnDetails(order.id)}
                      >
                        <Icon icon="ph:receipt" height={20} width={20} />
                      </button>

                      <button
                        className={`hover:opacity-50 text-blue-700`}
                        onClick={() => handleOnDetails(order.id, true)}
                      >
                        <Icon
                          icon="lsicon:print-outline"
                          height={20}
                          width={20}
                        />
                      </button>
                    </div>
                  </TableCell>
                  <TableCell>{order.receiptNo}</TableCell>
                  <TableCell className="text-nowrap">
                    {Formatter.datetime(order.createdAt)}
                  </TableCell>
                  <TableCell className="text-end font-mono">
                    {Formatter.money(order.cgst)}
                  </TableCell>
                  <TableCell className="text-end font-mono">
                    {Formatter.money(order.sgst)}
                  </TableCell>
                  <TableCell className="text-end font-mono">
                    {Formatter.money(order.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {form.isSubmitting && (
            <div className="absolute top-0 left-0 w-full h-full p-10 flex items-center justify-center bg-white/10 backdrop-blur-sm">
              <Spinner />
            </div>
          )}
        </ScrollView>
        <Pagination
          page={query.page}
          pages={result.pages}
          onChange={(props) => setQuery({ ...query, ...props })}
        />
      </div>
    </React.Fragment>
  );
}
