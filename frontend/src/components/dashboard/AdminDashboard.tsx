import Formatter from "@app/lib/formatter";
import DashboardApi from "@app/services/dashboard";
import { TimeFrame } from "@app/types/enums";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";

export default function AdminDashboard() {
  const navigate = useNavigate({ from: "/" });
  const timeFrame = useSearch({
    from: "/",
    select: (s) => (s as { duration: TimeFrame }).duration || TimeFrame.Daily,
  });

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
    <div className="grid grid-rows-[auto_1fr] gap-6 p-4 h-full">
      <div className="bg-white inline-flex w-min rounded-xl border overflow-hidden p-0.5 h-10">
        {Object.values(TimeFrame).map((value) => (
          <button
            key={value}
            value={value}
            onClick={() =>
              navigate({
                to: "/",
                search: {
                  duration: value,
                },
              })
            }
            className={`px-4 py-1.5 rounded-lg text-sm ${timeFrame == value ? "bg-lime-300/40 text-lime-900" : "text-gray-600"}`}
          >
            {value}
          </button>
        ))}
      </div>
      {isLoading && (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="border bg-white rounded-2xl h-60 flex flex-col gap-2 w-full row-span-2 py-6 dash-card shimmer" />
            <div className="border bg-white rounded-2xl h-28 p-5 flex flex-col gap-2 w-full dash-card shimmer" />
            <div className="border bg-white rounded-2xl h-28 p-5 flex flex-col gap-2 w-full dash-card shimmer" />
            <div className="border bg-white rounded-2xl h-28 p-5 flex flex-col gap-2 w-full dash-card shimmer" />
            <div className="border bg-white rounded-2xl h-28 p-5 flex flex-col gap-2 w-full dash-card shimmer" />
            <div className="border bg-white rounded-2xl h-28 p-5 flex flex-col gap-2 w-full dash-card shimmer" />
          </div>
        </div>
      )}

      {!isLoading && !!error && <>{error.message}</>}

      {!isLoading && !error && result && (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="border bg-white rounded-2xl h-60 flex flex-col gap-2 w-full row-span-2 py-6  dash-card">
              <p className="px-5 font-bold">Top Selling Items</p>
              <div className="px-5 flex-1 ">
                <table className="w-full">
                  <tbody>
                    {result.topSellingItems.length ? (
                      result.topSellingItems.map((item, i) => (
                        <tr key={i}>
                          <td className="py-1">{item.name}</td>
                          <td className="w-0 text-gray-700 py-1 font-semibold">
                            {item.count}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="py-1">
                          No orders yet, but every great journey starts with a
                          single step. Let’s make it happen! 🌟
                        </td>
                      </tr>
                    )}
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
        </div>
      )}
    </div>
  );
}
