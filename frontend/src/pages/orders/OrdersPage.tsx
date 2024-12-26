import ScrollView from "@app/components/ScrollView";
import { useCallback, useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import Formatter from "@app/lib/formatter";
import OrdersApi from "@app/services/orders";
import { IOrder } from "@app/types/order";

export default function ProductsPage() {
  const [query, setQuery] = useState({ page: 1, pages: 1, limit: 20 });
  const [result, setResult] = useState<{
    pages: number;
    page: number;
    records: Array<IOrder>;
  }>({
    pages: 1,
    page: 0,
    records: [],
  });
  const paginate = useCallback(
    () =>
      OrdersApi.paginate({ page: query.page, limit: query.limit }).then(
        (res) => {
          setResult(res);
          setQuery({ page: res.page, pages: res.pages, limit: query.limit });
        }
      ),
    [query.limit, query.page]
  );

  useEffect(() => {
    if (query.page != result.page) {
      paginate();
    }
  }, [paginate, query]);
  return (
    <div className="h-full bg-white p-4 grid grid-rows-[auto-1fr] gap-5">
      <div className="py-4 flex gap-4 items-center">
        <h2 className="text-2xl">Products</h2>
      </div>

      <ScrollView className="h-full bg-white border rounded-2xl">
        <table className="w-full">
          <thead>
            <tr className="sticky top-0 left-0 bg-gray-100 z-10">
              <td className="px-3 py-2  w-0">#</td>
              <td className="px-3 py-2  w-0">Receipt No</td>
              <td className="px-3 py-2 w-0">Date</td>
              <td className="px-3 py-2 w-0">CGST%</td>
              <td className="px-3 py-2 w-0">SGST%</td>
              <td className="px-3 py-2 w-0 text-end">Amount</td>

              <td className="px-3 py-2 w-0"></td>
            </tr>
          </thead>
          <tbody>
            {result.records.map((order, index: number) => (
              <tr key={`product-${order.id}`}>
                <td className="px-3 py-2">{index + 1}</td>
                <td className="px-4 py-2 w-0">{order.receiptNo}</td>
                <td className="px-4 py-2 w-0 text-nowrap">
                  {Formatter.datetime(order.createdAt)}
                </td>
                <td className="px-4 py-2 w-0">{Formatter.money(order.cgst)}</td>
                <td className="px-4 py-2 w-0">{Formatter.money(order.sgst)}</td>
                <td className="px-4 py-2 w-0">
                  {Formatter.money(order.amount)}
                </td>
                <td className="px-4 py-2 w-0 sticky right-0 bg-white">
                  <div className="flex flex-nowrap gap-2 text-gray-600">
                  <button className="hover:opacity-70 ">
                      <Icon icon="mingcute:print-line" height={20} width={20} />
                    </button>

                    <button className="hover:opacity-70 ">
                      <Icon icon="akar-icons:receipt" height={20} width={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollView>
    </div>
  );
}
