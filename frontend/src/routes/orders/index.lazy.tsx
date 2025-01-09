import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import Formatter from "@app/lib/formatter";
import OrdersApi from "@app/services/orders";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@app/components/ui/table/Table";
import Pagination from "@app/components/ui/Pagination";
import Input from "@app/components/ui/form/input";
import { IOrder, OrderStatus } from "@app/types/orders";
import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import Button from "@app/components/ui/form/button";

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
    records: Array<IOrder>;
  }>({
    pages: 1,
    page: 0,
    records: [],
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
            onReset={form.reset}
            className="h-9 flex gap-3"
          >
            <form.Field
              name="createdAt[0]"
              children={({ state, handleBlur, handleChange, name }) => (
                <Input
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
            <Button className="bg-lime-500 text-white">Search</Button>
            <Button className="bg-gray-300" type="reset">
              Reset
            </Button>
          </form>
        </div>

        <div className="bg-white border rounded-xl  overflow-x-auto overflow-hidden relative">
          <Table bordered>
            <TableHead>
              <TableRow className="sticky top-0 left-0 z-10" header>
                <TableCell>#</TableCell>
                <TableCell />
                <TableCell className="text-nowrap">Order No</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Table</TableCell>
                <TableCell>User</TableCell>

                <TableCell className="text-end w-0">Kot</TableCell>
                <TableCell className="w-0 text-end">Discount</TableCell>
                <TableCell className="text-end w-0">Created</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {result.records.map((order, index: number) => {
                return (
                  <TableRow key={`product-${order.id}`}>
                    <TableCell className="w-0">
                      {(query.page - 1) * query.limit + index + 1}
                    </TableCell>
                    <TableCell className="w-0 sticky left-0 bg-white">
                      <div className="inline-flex flex-nowrap gap-2 text-gray-600">
                        {order.invoiceId && (
                          <button
                            className={`hover:opacity-50`}
                            onClick={() =>
                              handleOnDetails(order.invoiceId as string)
                            }
                          >
                            <Icon icon="ph:receipt" height={20} width={20} />
                          </button>
                        )}

                        {[OrderStatus.Draft, OrderStatus.Ongoing].includes(
                          order.status,
                        ) && (
                          <Link
                            className={`hover:opacity-50`}
                            to={"/pos/" + order.id}
                            title="Go to billing"
                          >
                            <Icon
                              icon="hugeicons:payment-02"
                              height={20}
                              width={20}
                            />
                          </Link>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="w-0">{order.orderNo}</TableCell>
                    <TableCell>
                      <OrderStatusLabel order={order} />
                    </TableCell>

                    <TableCell className="text-nowrap">{order.type}</TableCell>
                    <TableCell className="text-nowrap">
                      {order.table?.name}
                    </TableCell>
                    <TableCell className="text-nowrap">
                      {order.user?.name}
                    </TableCell>

                    <TableCell className="text-nowrap text-end">
                      {order.status != OrderStatus.Cancelled && (
                        <>
                          {order.kotList?.map((e) => (
                            <button
                              className="inline-flex mx-0.5 bg-lime-600 rounded-xl px-1 p-0.5 items-center justify-center text-white text-xs"
                              key={e.id}
                            >
                              {e.tokenNo}
                            </button>
                          ))}
                        </>
                      )}
                    </TableCell>

                    <TableCell className="text-nowrap text-end">
                      {Formatter.money(order.discount)}
                    </TableCell>
                    <TableCell className="text-nowrap">
                      {Formatter.datetime(order.createdAt)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <Pagination
          page={query.page}
          pages={result.pages}
          onChange={(props) => setQuery({ ...query, ...props })}
        />
      </div>
    </React.Fragment>
  );
}
