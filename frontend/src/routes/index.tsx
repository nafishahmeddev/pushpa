import Formatter from "@app/lib/formatter";
import DashboardApi from "@app/services/dashboard";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
export const Route = createFileRoute("/")({ component: RouteComponent });

function RouteComponent() {
  const [result, setResult] = useState<{
    tax: number;
    netSales: number;
    revenue: number;
    averageOrder: number;
    orders: number;
    topSellingItems: Array<{
      name: string;
      count: number;
    }>;
  }>({
    tax: 0,
    netSales: 0,
    revenue: 0,
    averageOrder: 0,
    orders: 0,
    topSellingItems: [],
  });

  const fetchStats = () => DashboardApi.stats().then(setResult);
  useEffect(() => {
    fetchStats();
  }, []);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 py-6">
      <div className="border bg-white rounded-2xl h-60 flex flex-col gap-2 w-full row-span-2 py-6">
        <p className="px-6 font-bold">Top Selling Items</p>
        <div className="px-6 flex-1 ">
          <table className="w-full">
            <tbody>
              {result.topSellingItems.map((item, i) => (
                <tr key={i}>
                  <td className="py-1">{item.name}</td>
                  <td className="w-0 text-lime-700 py-1 font-mono">{item.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="border bg-white rounded-2xl h-28 p-6 flex flex-col gap-2 w-full">
        <p className="font-bold">Orders</p>
        <span className="text-4xl font-mono">{result.orders}</span>
      </div>

      <div className="border bg-white rounded-2xl h-28 p-6 flex flex-col gap-2 w-full">
        <p className="font-bold">Avg. Order Value</p>
        <span className="text-4xl font-mono">{Formatter.money(result.averageOrder)}</span>
      </div>

      <div className="border bg-white rounded-2xl h-28 p-6 flex flex-col gap-2 w-full">
        <p className="font-bold">Revenue</p>
        <span className="text-4xl font-mono">{Formatter.money(result.revenue)}</span>
      </div>
      <div className="border bg-white rounded-2xl h-28 p-6 flex flex-col gap-2 w-full">
        <p className="font-bold">Tax</p>
        <span className="text-4xl font-mono">{Formatter.money(result.tax)}</span>
      </div>
      <div className="border bg-white rounded-2xl h-28 p-6 flex flex-col gap-2 w-full">
        <p className="font-bold">Net Sales</p>
        <span className="text-4xl font-mono">{Formatter.money(result.netSales)}</span>
      </div>
    </div>
  );
}
