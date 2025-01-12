import React, { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import InvoiceApi from "@app/services/invoices";
import Input from "@app/components/ui/form/input";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import Button from "@app/components/ui/form/button";
import DataTable, { Column, SortType } from "@app/components/ui/DataTable";
import { PaginationResponse } from "@app/types/pagination";
import { IInvoice, InvoiceStatus } from "@app/types/invoice";
import moment from "moment";

export const Route = createLazyFileRoute("/invoices/")({
  component: RouteComponent,
});

const InvoiceStatusLabel = ({ invoice }: { invoice: IInvoice }) => {
  const classNames = ["border px-1 py-0 text-sm rounded-lg"];
  switch (invoice.status) {
    case InvoiceStatus.Cancelled: {
      classNames.push("border-gray-600/50 text-gray-600  bg-gray-50");
      break;
    }

    case InvoiceStatus.Paid: {
      classNames.push("border-green-600/50 text-green-600  bg-green-50");
      break;
    }
  }

  return <label className={classNames.join(" ")}>{invoice.status}</label>;
};

type FormType = {
  filter: {
    receiptNo: string;
    createdAt: [from: string, to: string];
  };
  query: { page: number; limit: number };
  order: [field: keyof IInvoice, sort: SortType];
};

function RouteComponent() {
  const columns = useMemo<Array<Column<IInvoice>>>(
    () => [
      {
        key: "id",
        label: "",
        width: 0,
        renderColumn: (_, { record: invoice }) => (
          <div className="inline-flex flex-nowrap gap-2 text-gray-600">
            {invoice.id && (
              <button
                className={`hover:opacity-50`}
                onClick={() => handleOnDetails(invoice.id as string)}
              >
                <Icon icon="ph:receipt" height={20} width={20} />
              </button>
            )}
          </div>
        ),
      },
      {
        key: "receiptNo",
        label: "Receipt No",
      },

      {
        key: "status",
        label: "Receipt No",
        renderColumn: (_, { record }) => (
          <InvoiceStatusLabel invoice={record} />
        ),
      },
      {
        key: "createdAt",
        label: "Dated",
        sortable: true,
        nowrap: true,
        type: "datetime",
      },
      {
        key: "subTotal",
        label: "Subtotal",
        type: "amount",
        width: 0,
      },
      {
        key: "tax",
        label: "Tax",
        type: "amount",
        width: 0,
      },

      {
        key: "discount",
        label: "Discount",
        type: "amount",
        width: 0,
      },

      {
        key: "amount",
        label: "Amount",
        type: "amount",
        width: 0,
      },
    ],
    [],
  );
  const [result, setResult] = useState<PaginationResponse<IInvoice>>({
    pages: 1,
    page: 0,
    count: 0,
    records: [],
  });

  const form = useForm<FormType>({
    defaultValues: {
      filter: {
        receiptNo: "",
        createdAt: ["", ""],
      },
      query: { page: 1, limit: 20 },
      order: ["createdAt", "DESC"],
    },
    onSubmit: async ({ value, formApi }) => {
      return InvoiceApi.paginate(
        { page: value.query.page, limit: value.query.limit },
        {
          ...value.filter,
          createdAt: [
            value.filter.createdAt[0]
              ? moment(value.filter.createdAt[0]).startOf("day").toString()
              : "",
            value.filter.createdAt[1]
              ? moment(value.filter.createdAt[1]).endOf("day").toString()
              : "",
          ],
        },
        value.order,
      ).then((res) => {
        formApi.setFieldValue("query.page", res.page);
        setResult(res);
      });
    },
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
        w.focus();
        w.print();
      }, 1000);
    }
  };

  useEffect(() => {
    form.handleSubmit();
  }, []);
  return (
    <React.Fragment>
      <div className=" p-4 flex flex-col gap-5">
        <div className=" flex gap-4 items-center">
          <div className="flex-1 flex flex-col items-start justify-center">
            <h2 className="text-2xl">Invoice</h2>
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
              name="filter.receiptNo"
              children={({ state, handleBlur, handleChange, name, form }) => (
                <Input
                  placeholder="Receipt No"
                  type="text"
                  value={state.value}
                  onChange={(e) => {
                    form.setFieldValue("filter.createdAt", ["", ""]);
                    handleChange(e.target.value);
                  }}
                  onBlur={handleBlur}
                  name={name}
                  error={state.meta.errors.join(" ")}
                  touched={state.meta.isTouched}
                />
              )}
            />
            <form.Field
              name="filter.createdAt[0]"
              children={({ state, handleBlur, handleChange, name }) => (
                <Input
                  placeholder="Date From"
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
              name="filter.createdAt[1]"
              children={({ state, handleBlur, handleChange, name }) => (
                <Input
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
            <Button className="bg-lime-500 text-white" type="submit">
              Search
            </Button>
            <Button className="bg-gray-300" type="reset">
              Reset
            </Button>
          </form>
        </div>

        <DataTable
          serial
          columns={columns}
          getId={(record) => record.id as string}
          records={result.records}
          recordsCount={result.count}
          loading={form.state.isSubmitting}
          sortState={{
            field: form.state.values.order[0],
            order: form.state.values.order[1],
          }}
          sortStateChange={({ field, order }) => {
            form.setFieldValue("order[0]", field);
            form.setFieldValue("order[1]", order);
            form.setFieldValue("query.page", 1);
            form.handleSubmit();
          }}
          paginationState={{
            page: result.page,
            limit: form.state.values.query.limit,
          }}
          paginationStateChange={({ page, limit }) => {
            form.setFieldValue("query.page", page);
            form.setFieldValue("query.limit", limit);
            form.handleSubmit();
          }}
        />
      </div>
    </React.Fragment>
  );
}
