import PendingComponent from "@app/components/PendingComponent";
import Formatter from "@app/lib/formatter";
import DashboardApi from "@app/services/dashboard";
import { TimeFrame } from "@app/types/enums";
import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useState } from "react";
export const Route = createLazyFileRoute("/")({ component: RouteComponent });

function RouteComponent() {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>(TimeFrame.Daily);
  const {
    data: result,
    isLoading,
    error,
  } = useQuery<{
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
    queryKey: ["dashboard", { timeFrame }],
    queryFn: () => DashboardApi.stats({ timeFrame }),
  });

  return (
    <div className="grid grid-rows-[auto_auto] gap-6 p-4">
      <div className="bg-white inline-flex w-min rounded-xl border">
        {Object.values(TimeFrame).map((value) => (
          <button
            key={value}
            value={value}
            onClick={() => setTimeFrame(value)}
            className={`px-4 py-1.5 rounded-xl ${timeFrame == value && "bg-lime-500 text-white"}`}
          >
            {value}
          </button>
        ))}
      </div>
      {isLoading && <PendingComponent />}

      {!isLoading && !!error && <>{error.message}</>}

      {!isLoading && !error && result && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="border bg-white rounded-2xl h-60 flex flex-col gap-2 w-full row-span-2 py-6  dash-card">
            <p className="px-5 font-bold">Top Selling Items</p>
            <div className="px-5 flex-1 ">
              <table className="w-full">
                <tbody>
                  {result.topSellingItems.map((item, i) => (
                    <tr key={i}>
                      <td className="py-1">{item.name}</td>
                      <td className="w-0 text-gray-700 py-1 ">{item.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="border bg-white rounded-2xl h-28 p-5 flex flex-col gap-2 w-full dash-card">
            <p className="font-bold">Orders</p>
            <span className="text-4xl  text-gray-700">{result.orders}</span>
          </div>

          <div className="border bg-white rounded-2xl h-28 p-5 flex flex-col gap-2 w-full dash-card">
            <p className="font-bold">Avg. Order Value</p>
            <span className="text-4xl  text-gray-700">
              {Formatter.money(result.averageOrder)}
            </span>
          </div>

          <div className="border bg-white rounded-2xl h-28 p-5 flex flex-col gap-2 w-full dash-card">
            <p className="font-bold">Revenue</p>
            <span className="text-4xl  text-gray-700">
              {Formatter.money(result.revenue)}
            </span>
          </div>
          <div className="border bg-white rounded-2xl h-28 p-5 flex flex-col gap-2 w-full dash-card">
            <p className="font-bold">Tax</p>
            <span className="text-4xl  text-gray-700">
              {Formatter.money(result.tax)}
            </span>
          </div>
          <div className="border bg-white rounded-2xl h-28 p-5 flex flex-col gap-2 w-full dash-card">
            <p className="font-bold">Net Sales</p>
            <span className="text-4xl  text-gray-700">
              {Formatter.money(result.netSales)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
