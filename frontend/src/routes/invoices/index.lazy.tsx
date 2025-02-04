import React, { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import InvoiceApi from "@app/services/invoices";
import Input from "@app/components/baseui/Input";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import Button from "@app/components/baseui/Button";
import DataTable, { Column, SortType } from "@app/components/baseui/DataTable";
import { PaginationResponse } from "@app/types/pagination";
import { IInvoice, InvoiceStatus } from "@app/types/invoice";
import dayjs from "dayjs";
import PopMenu, {
  PopMenuContent,
  PopMenuItem,
  PopMenuTrigger,
} from "@app/components/baseui/PopMenu";

export const Route = createLazyFileRoute("/invoices/")({
  component: RouteComponent,
});

const InvoiceStatusLabel = ({ invoice }: { invoice: IInvoice }) => {
  const classNames = ["border px-1 py-0 text-sm rounded-xl"];
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
          <PopMenu>
            <PopMenuTrigger>
              <button className="hover:opacity-70 border p-0.5 rounded-md">
                <Icon icon="mingcute:more-2-line" height={18} width={18} />
              </button>
            </PopMenuTrigger>
            <PopMenuContent>
              <PopMenuItem
                onClick={() => handleOnDetails(invoice.id as string, false)}
              >
                <Icon icon="ph:receipt-bold" height={20} width={20} />{" "}
                <span>View Receipt</span>
              </PopMenuItem>
              {invoice.status != InvoiceStatus.Cancelled && (
                <PopMenuItem
                  onClick={() => handleOnDetails(invoice.id as string, true)}
                >
                  <Icon icon="mingcute:print-line" height={20} width={20} />{" "}
                  <span>View Receipt</span>
                </PopMenuItem>
              )}
            </PopMenuContent>
          </PopMenu>
        ),
      },
      {
        key: "receiptNo",
        label: "Receipt No",
      },
      {
        key: "status",
        label: "Status",
        renderColumn: (_, { record }) => (
          <InvoiceStatusLabel invoice={record} />
        ),
      },
      {
        key: "createdAt",
        label: "Date",
        sortable: true,
        nowrap: true,
        type: "date",
      },
      {
        key: "createdAt",
        label: "Time",
        nowrap: true,
        type: "time",
      },
      {
        key: "subTotal",
        label: "Subtotal",
        type: "amount",
      },
      {
        key: "tax",
        label: "Tax",
        type: "amount",
      },

      {
        key: "discount",
        label: "Discount",
        type: "amount",
      },

      {
        key: "amount",
        label: "Amount",
        type: "amount",
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
              ? dayjs(value.filter.createdAt[0]).startOf("day").toString()
              : "",
            value.filter.createdAt[1]
              ? dayjs(value.filter.createdAt[1]).endOf("day").toString()
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
            onReset={() => form.reset()}
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
            <Button className="bg-indigo-500 text-white" type="submit">
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
