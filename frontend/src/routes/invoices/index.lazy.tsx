import ScrollView from "@app/components/ui/ScrollView";
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import Formatter from "@app/lib/formatter";
import OrdersApi from "@app/services/invoices";
import { IInvoice } from "@app/types/invoice";
import {
  OrderReceiptDialog,
  OrderReceiptDialogProps,
} from "@app/components/invoice/OrderReceiptDialog";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@app/components/ui/table/Table";
import Pagination from "@app/components/ui/Pagination";
import Input from "@app/components/ui/form/input";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import Button from "@app/components/ui/form/button";

export const Route = createLazyFileRoute("/invoices/")({
  component: RouteComponent,
});

function RouteComponent() {
  const form = useForm({
    defaultValues: {
      createdAt: ["", ""],
    },
    onSubmit: ({ value }) =>
      OrdersApi.paginate({ page: query.page, limit: query.limit }, value).then(
        (res) => {
          setResult(res);
          setQuery({ page: res.page, limit: query.limit });
        },
      ),
  });
  const [query, setQuery] = useState({ page: 1, limit: 20 });
  const [result, setResult] = useState<{
    pages: number;
    page: number;
    records: Array<IInvoice>;
  }>({
    pages: 1,
    page: 0,
    records: [],
  });
  const [oderDetailsDialog, setOderDetailsDialog] =
    useState<OrderReceiptDialogProps>({
      open: false,
    });

  const handleOnDetails = (invoiceId: string, print: boolean = false) => {
    const w = window.open(
      import.meta.env.VITE_BASE_URL +
        `/invoices/${invoiceId}/receipt?authorization=${localStorage.getItem("accessToken")}`,
      "_blank",
      "location=yes,height=600,width=350,scrollbars=yes,status=yes",
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
      form.handleSubmit();
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
            <h2 className="text-2xl">Invoices</h2>
            <p>Showing Invoices for Today</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            onReset={form.reset}
            className="h-9 flex gap-3"
          >
            <form.Field
              name="createdAt[0]"
              children={({ state, handleBlur, handleChange, name }) => (
                <Input
                  className="border rounded-xl px-3"
                  placeholder="Date from"
                  type="date"
                  value={state.value}
                  onChange={(e) => handleChange(e.target.value)}
                  onBlur={handleBlur}
                  name={name}
                  error={state.meta.errors.join(" ")}
                  touched={state.meta.isTouched}
                />
              )}
            />

            <form.Field
              name="createdAt[1]"
              children={({ state, handleBlur, handleChange, name }) => (
                <Input
                  className="border rounded-xl px-3"
                  placeholder="Date to"
                  type="date"
                  value={state.value}
                  onChange={(e) => handleChange(e.target.value)}
                  onBlur={handleBlur}
                  name={name}
                  error={state.meta.errors.join(" ")}
                  touched={state.meta.isTouched}
                />
              )}
            />

            <Button className="rounded-xl px-3 bg-lime-500 text-white hover:opacity-50">
              Search
            </Button>
            <Button
              className="rounded-xl px-3 bg-gray-300 hover:opacity-50"
              type="reset"
            >
              Reset
            </Button>
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
                <TableCell className="text-end w-0">Tax</TableCell>
                <TableCell className="text-end w-0">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {result.records.map((invoice, index: number) => (
                <TableRow key={`product-${invoice.id}`}>
                  <TableCell className="px-3 py-2 w-0">
                    {(query.page - 1) * query.limit + index + 1}
                  </TableCell>
                  <TableCell className="px-0 py-2 w-0 sticky left-0 bg-white">
                    <div className="inline-flex flex-nowrap gap-2 text-gray-600 px-2">
                      <button
                        className={`hover:opacity-50`}
                        onClick={() => handleOnDetails(invoice.id)}
                      >
                        <Icon icon="ph:receipt" height={20} width={20} />
                      </button>

                      <button
                        className={`hover:opacity-50 text-lime-700`}
                        onClick={() => handleOnDetails(invoice.id, true)}
                      >
                        <Icon
                          icon="lsicon:print-outline"
                          height={20}
                          width={20}
                        />
                      </button>
                    </div>
                  </TableCell>
                  <TableCell>{invoice.receiptNo}</TableCell>
                  <TableCell className="text-nowrap">
                    {Formatter.datetime(invoice.createdAt)}
                  </TableCell>
                  <TableCell className="text-end">
                    {Formatter.money(invoice.tax)}
                  </TableCell>
                  <TableCell className="text-end">
                    {Formatter.money(invoice.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
