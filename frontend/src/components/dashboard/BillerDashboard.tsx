import DashboardApi from "@app/services/dashboard";
import { TimeFrame } from "@app/types/enums";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";

export default function BillerDashboard() {
  const navigate = useNavigate({ from: "/" });
  const timeFrame = useSearch({
    from: "/",
    select: (s) => (s as { duration: TimeFrame }).duration || TimeFrame.Day,
  });
  const {
    data: result,
    isLoading,
    error,
  } = useQuery<{
    orders: number;
  }>({
    queryKey: ["dashboard", { timeFrame }],
    queryFn: () => DashboardApi.stats({ timeFrame }),
  });

  return (
    <div className="grid grid-rows-[auto_1fr] gap-6 p-4 h-full">
      <div className="bg-white inline-flex w-min rounded-xl border overflow-hidden p-0.5 h-10">
        {Object.values(TimeFrame)
          .filter((e) => e != TimeFrame.Custom)
          .map((value) => (
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
              className={`px-4 py-1.5 rounded-lg text-sm ${timeFrame == value ? "bg-indigo-300/40 text-indigo-900" : "text-gray-600"}`}
            >
              {value}
            </button>
          ))}
      </div>
      {isLoading && (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="border bg-white rounded-2xl h-28 p-5 flex flex-col gap-2 w-full dash-card shimmer" />
          </div>
        </div>
      )}

      {!isLoading && !!error && <>{error.message}</>}

      {!isLoading && !error && result && (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="border bg-white rounded-2xl h-28 p-5 flex flex-col gap-2 w-full dash-card">
              <p className="font-bold">Orders</p>
              <span className="text-4xl  text-gray-700">{result.orders}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
