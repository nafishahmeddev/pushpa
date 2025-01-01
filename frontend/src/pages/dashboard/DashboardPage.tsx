import ScrollView from "@app/components/ui/ScrollView";
import Formatter from "@app/lib/formatter";
import DashboardApi from "@app/services/dashboard";
import { useEffect, useState } from "react";

export default function DashboardPage() {
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
    <div className="h-full p-4 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-3 auto-rows-min">
      <div className="border bg-white rounded-xl h-[215px] flex flex-col gap-2 w-full row-span-2 py-4">
        <p className="px-4">Top Selling Items</p>
        <div className="px-4 flex-1 ">
          <table className="text-sm w-full">
            <tbody>
              {result.topSellingItems.map((item, i) => (
                <tr key={i}>
                  <td>{item.name}</td>
                  <td className="w-0 text-lime-700">{item.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="border bg-white rounded-xl h-[100px] p-4 flex flex-col gap-2 w-full">
        <p>Orders</p>
        <span className="text-2xl text-lime-700">{result.orders}</span>
      </div>

      <div className="border bg-white rounded-xl h-[100px] p-4 flex flex-col gap-2 w-full">
        <p>Avg. Order Value</p>
        <span className="text-2xl text-lime-700">{Formatter.money(result.averageOrder)}</span>
      </div>

      <div className="border bg-white rounded-xl h-[100px] p-4 flex flex-col gap-2 w-full">
        <p>Revenue</p>
        <span className="text-2xl text-lime-700">{Formatter.money(result.revenue)}</span>
      </div>
      <div className="border bg-white rounded-xl h-[100px] p-4 flex flex-col gap-2 w-full">
        <p>Tax</p>
        <span className="text-2xl text-lime-700">{Formatter.money(result.tax)}</span>
      </div>
      <div className="border bg-white rounded-xl h-[100px] p-4 flex flex-col gap-2 w-full">
        <p>Net Sales</p>
        <span className="text-2xl text-lime-700">{Formatter.money(result.netSales)}</span>
      </div>
    </div>
  );
}
