import React, { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import OrdersApi from "@app/services/orders";
import Input from "@app/components/baseui/Input";
import { IKot, IOrder, OrderStatus } from "@app/types/orders";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import Button from "@app/components/baseui/Button";
import DataTable, { Column, SortType } from "@app/components/baseui/DataTable";
import { PaginationResponse } from "@app/types/pagination";
import Select from "@app/components/baseui/Select";
import toast from "react-hot-toast";
import { AuthStateLoggedIn, useAuthStore } from "@app/store/auth";
import { UserDesignation } from "@app/types/user";
import dayjs from "dayjs";
import OrderBackEntryFormDialog from "@app/components/form-dialogs/OrderBackEntryFormDialog";
import { AxiosError } from "axios";
import PopMenu, {
  PopMenuTrigger,
  PopMenuContent,
  PopMenuItem,
} from "@app/components/baseui/PopMenu";

export const Route = createLazyFileRoute("/orders/")({
  component: RouteComponent,
});

const OrderStatusLabel = ({ order }: { order: IOrder }) => {
  const classNames = ["border px-1 py-0 text-sm rounded-lg"];
  switch (order.status) {
    case OrderStatus.Ongoing: {
      classNames.push("border-orange-600/50 text-orange-600 bg-orange-50");
      break;
    }
    case OrderStatus.Draft: {
      classNames.push("border-yellow-600/50 text-yellow-600  bg-yellow-50");
      break;
    }
    case OrderStatus.Cancelled: {
      classNames.push("border-gray-600/50 text-gray-600  bg-gray-50");
      break;
    }
    case OrderStatus.Paid: {
      classNames.push("border-blue-600/50 text-blue-600  bg-blue-50");
      break;
    }
    case OrderStatus.Completed: {
      classNames.push("border-green-600/50 text-green-600  bg-green-50");
      break;
    }
  }

  return <label className={classNames.join(" ")}>{order.status}</label>;
};

type FormType = {
  filter: {
    createdAt: [from: string, to: string];
    orderNo: string;
    status?: OrderStatus;
  };
  query: { page: number; limit: number };
  order: [field: keyof IOrder, sort: SortType];
};

function RouteComponent() {
  const [auth] = useAuthStore<AuthStateLoggedIn>();
  const navigate = Route.useNavigate();
  const columns = useMemo<Array<Column<IOrder>>>(
    () => [
      {
        key: "id",
        label: "",
        width: 0,
        renderColumn: (_, { record: order }) => (
          <PopMenu>
            <PopMenuTrigger>
              <button className="hover:opacity-70 border p-0.5 rounded-full">
                <Icon icon="mingcute:more-2-line" height={18} width={18} />
              </button>
            </PopMenuTrigger>
            <PopMenuContent>
              {order.invoiceId &&
                [OrderStatus.Completed, OrderStatus.Paid].includes(
                  order.status,
                ) && (
                  <PopMenuItem
                    className={`hover:opacity-50 flex items-center justify-center`}
                    onClick={() => handleOnDetails(order.invoiceId as string)}
                    title="Show Invoice"
                  >
                    <Icon icon="ph:receipt-bold" height={20} width={20} />
                    <span>Show Invoice</span>
                  </PopMenuItem>
                )}

              {[OrderStatus.Draft, OrderStatus.Ongoing].includes(
                order.status,
              ) && (
                <PopMenuItem
                  className={`hover:opacity-50 flex items-center justify-center`}
                  onClick={() => navigate({ to: "/pos/" + order.id })}
                  title="Go to billing"
                >
                  <Icon icon="hugeicons:payment-02" height={20} width={20} />
                  <span>Go to billing</span>
                </PopMenuItem>
              )}

              {[OrderStatus.Completed].includes(order.status) &&
                [UserDesignation.Admin, UserDesignation.Owner].includes(
                  auth.user.designation,
                ) && (
                  <PopMenuItem
                    className={`hover:opacity-50 flex items-center justify-center text-red-600`}
                    onClick={() => handleOnCancel(order.id as string)}
                  >
                    <Icon icon="tabler:cancel" height={20} width={20} />
                    <span>Cancel Order</span>
                  </PopMenuItem>
                )}

              {[OrderStatus.Draft].includes(order.status) && (
                <PopMenuItem
                  className={`hover:opacity-50 flex items-center justify-center text-red-600`}
                  onClick={() => handleOnDelete(order.id as string)}
                >
                  <Icon icon="mi:delete" height={20} width={20} />
                  <span>Delete Order</span>
                </PopMenuItem>
              )}
            </PopMenuContent>
          </PopMenu>
        ),
      },
      {
        key: "orderNo",
        label: "Order No",
      },
      {
        key: "status",
        label: "Status",
        renderColumn: (_, { record: order }) => (
          <OrderStatusLabel order={order} />
        ),
      },

      {
        key: "type",
        label: "Type",
      },
      {
        key: "tableId",
        label: "Table",
        renderColumn: (_, { record }) => record.table?.name,
      },
      {
        key: "userId",
        label: "Created By",
        nowrap: true,
        renderColumn: (_, { record }) => record.user?.name,
      },

      {
        key: "kotList",
        label: "Tokens",
        renderColumn: (kots: Array<IKot>) => (
          <>
            {kots?.map((e) => (
              <button
                className="inline-flex mx-0.5 bg-indigo-600 rounded-lg px-1 p-0.5 items-center justify-center text-white text-xs"
                key={e.id}
              >
                {e.tokenNo}
              </button>
            ))}
          </>
        ),
      },
      {
        key: "createdAt",
        label: "Date",
        sortable: true,
        width: 0,
        nowrap: true,
        type: "date",
      },
      {
        key: "createdAt",
        label: "Time",
        width: 0,
        nowrap: true,
        type: "time",
      },
    ],
    [],
  );
  const [result, setResult] = useState<PaginationResponse<IOrder>>({
    pages: 1,
    page: 0,
    count: 0,
    records: [],
  });

  const form = useForm<FormType>({
    defaultValues: {
      filter: {
        createdAt: ["", ""],
        orderNo: "",
        status: undefined,
      },
      query: { page: 1, limit: 20 },
      order: ["createdAt", "DESC"],
    },
    onSubmit: async ({ value, formApi }) => {
      return OrdersApi.paginate(
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

  const [orderFormDialog, setFormDialog] = useState<{ open: boolean }>({
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
        w.focus();
        w.print();
      }, 1000);
    }
  };

  const handleOnCancel = (orderId: string) => {
    if (!confirm("Are you sure want to cancel the order?")) return;
    const promise = OrdersApi.cancelOrder(orderId).then(form.handleSubmit);
    toast.promise(promise, {
      loading: "Cancelling order.",
      success: "Successfully cancelled order.",
      error: (err: AxiosError) => err.message,
    });
  };

  const handleOnDelete = (orderId: string) => {
    if (!confirm("Are you sure want to delete the order?")) return;
    const promise = OrdersApi.deleteOrder(orderId).then(form.handleSubmit);
    toast.promise(promise, {
      loading: "Deleting order.",
      success: "Successfully deleted order.",
      error: (err: AxiosError) => err.message,
    });
  };

  useEffect(() => {
    form.handleSubmit();
  }, []);
  return (
    <React.Fragment>
      <div className=" p-4 flex flex-col gap-5">
        <div className=" flex gap-4 items-center">
          <div className="flex-1 flex flex-col items-start justify-center">
            <h2 className="text-2xl">Orders</h2>
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
              name="filter.orderNo"
              children={({ state, handleBlur, handleChange, name, form }) => (
                <Input
                  placeholder="Order No"
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
              name="filter.status"
              children={({ state, handleBlur, handleChange, name }) => (
                <Select
                  value={state.value}
                  onChange={(e) =>
                    handleChange(e.target.value as OrderStatus | undefined)
                  }
                  onBlur={handleBlur}
                  name={name}
                  error={state.meta.errors.join(" ")}
                  touched={state.meta.isTouched}
                >
                  <option value="">Status</option>
                  {Object.entries(OrderStatus).map(([key, value]) => (
                    <option value={value} key={key}>
                      {key}
                    </option>
                  ))}
                </Select>
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
            {[UserDesignation.Admin, UserDesignation.Owner].includes(
              auth.user.designation,
            ) && (
              <Button
                className="bg-gray-300"
                type="button"
                onClick={() => setFormDialog({ open: true })}
              >
                Create New Order
              </Button>
            )}
          </form>
        </div>

        <OrderBackEntryFormDialog
          {...orderFormDialog}
          onSave={() => {
            form.handleSubmit();
            setFormDialog({ open: false });
          }}
          onReset={() => setFormDialog({ open: false })}
        />

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
