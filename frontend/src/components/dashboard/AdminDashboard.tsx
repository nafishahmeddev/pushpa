import Formatter from "@app/lib/formatter";
import DashboardApi from "@app/services/dashboard";
import { TimeFrame } from "@app/types/enums";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import Input from "../baseui/Input";
import Button from "../baseui/Button";
import dayjs, { ManipulateType } from "dayjs";
import { Icon } from "@iconify/react/dist/iconify.js";
import SalesChart from "./charts/SalesChart";
import utc from "dayjs/plugin/utc";
import advancedFormat from "dayjs/plugin/advancedFormat";
import minmax from "dayjs/plugin/minMax";
dayjs.extend(utc);
dayjs.extend(advancedFormat);
dayjs.extend(minmax);

const format = (timeFrame: TimeFrame, date: string) => {
  if (TimeFrame.Day == timeFrame) {
    return dayjs(date).format("hh A");
  } else if (TimeFrame.Week == timeFrame) {
    return dayjs(date).format("Do MMM");
  } else if (TimeFrame.Month == timeFrame) {
    return dayjs(date).format("Do");
  } else if (TimeFrame.Year == timeFrame) {
    return dayjs(date).format("MMM");
  } else {
    return dayjs(date).format("DD MMM YY");
  }
};

const enumerate = (
  timeFrame: TimeFrame,
  data: Array<{ label: string; value: number }>,
  range: { start?: string; end?: string } | undefined = undefined,
) => {
  const dataMap: Map<string, number> = new Map(
    data.map((e) => [e.label, e.value]),
  );
  let diff: ManipulateType = "day";
  let start = dayjs(range?.start).startOf("day");
  let end = dayjs(range?.end).endOf("day");
  let format = "YYYY-MM-DD 00:00:00";
  if (TimeFrame.Day == timeFrame) {
    diff = "hour";
    start = dayjs().startOf("day");
    end = dayjs().endOf("hour");
    format = "YYYY-MM-DD HH:00:00";
  } else if (TimeFrame.Week == timeFrame) {
    diff = "day";
    start = dayjs().startOf("week");
    end = dayjs().endOf("day");
    format = "YYYY-MM-DD 00:00:00";
  } else if (TimeFrame.Month == timeFrame) {
    diff = "day";
    start = dayjs().startOf("month");
    end = dayjs().endOf("day");
    format = "YYYY-MM-DD 00:00:00";
  } else if (TimeFrame.Year == timeFrame) {
    diff = "month";
    start = dayjs().startOf("year");
    end = dayjs().endOf("month");
    format = "YYYY-MM-01 00:00:00";
  } else {
    diff = "day";
    start = dayjs.max(dayjs(range?.start), dayjs(data[0].label)).startOf("day");
    end = dayjs.min(dayjs(range?.end), dayjs()).endOf("day");
    format = "YYYY-MM-DD 00:00:00";
  }
  let currentDate = dayjs(start);
  const ranges: typeof data = [];
  while (currentDate.isBefore(end) || currentDate.isSame(end)) {
    const label: string = currentDate.format(format) as string;
    ranges.push({
      label: currentDate.format(format),
      value: Number(dataMap.get(label) || 0),
    });
    currentDate = currentDate.add(1, diff);
  }
  return ranges;
};
export default function AdminDashboard() {
  const navigate = useNavigate({ from: "/" });
  const timeFrame = useSearch({
    from: "/",
    select: (s) => (s as { duration: TimeFrame }).duration || TimeFrame.Day,
  });

  const from: string | undefined = useSearch({
    from: "/",
    select: (s) => (s as { from: string | undefined }).from,
  });

  const to: string | undefined = useSearch({
    from: "/",
    select: (s) => (s as { to: string | undefined }).to,
  });

  const [modal, setModal] = useState({
    open: false,
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
    salesChart: Array<{ label: string; value: number }>;
    orderChart: Array<{ label: string; value: number }>;
  }>({
    queryKey: ["dashboard", { timeFrame, from, to }],
    queryFn: () => DashboardApi.stats({ timeFrame, from, to }),
  });

  const handleOnChange = (timeFrame: TimeFrame) => {
    if (timeFrame == TimeFrame.Custom) {
      setModal({ open: true });
    } else {
      navigate({
        to: "/",
        search: {
          duration: timeFrame,
        },
      });
    }
  };

  return (
    <div className="grid grid-rows-[auto_1fr] gap-6 p-4 h-full">
      <dialog
        open={modal.open}
        className="open:visible group h-full w-full collapse  transition-all flex z-40 top-0 left-0 bg-black/30 backdrop-blur-sm items-center justify-center"
      >
        <form
          className="p-6 min-w-[350px] bg-white rounded-xl flex flex-col gap-5 group-open:opacity-100 group-open:scale-100 scale-50 opacity-0 transition-all"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const fd = new FormData(e.target as HTMLFormElement);
            const from = fd.get("from");
            const to = fd.get("to");
            navigate({
              to: "/",
              search: {
                duration: TimeFrame.Custom,
                from: from,
                to: to,
              },
            });
            setModal({ open: false });
          }}
        >
          <h3 className="text-lg">Select date range</h3>
          {modal.open && (
            <>
              <Input
                type="date"
                name="from"
                label="Date From"
                required
                defaultValue={from}
              />
              <Input
                type="date"
                name="to"
                label="Date To"
                required
                defaultValue={to}
              />
            </>
          )}
          <div className="flex gap-2 justify-end mt-5">
            <Button
              className="bg-gray-200"
              type="button"
              onClick={() => setModal({ open: false })}
            >
              Cancel
            </Button>
            <Button className="bg-indigo-600 text-white" type="submit">
              Filter Date
            </Button>
          </div>
        </form>
      </dialog>

      <div className="bg-white inline-flex w-min rounded-xl border overflow-hidden p-0.5 h-10">
        {Object.values(TimeFrame).map((value) => (
          <button
            key={value}
            value={value}
            onClick={() => handleOnChange(value)}
            className={`px-4 py-1.5 rounded-lg text-sm text-nowrap flex flex-nowrap items-center gap-2 ${timeFrame == value ? "bg-indigo-300/40 text-indigo-900" : "text-gray-600"}`}
          >
            {value == TimeFrame.Custom ? (
              <>
                <Icon icon="akar-icons:calendar" height={16} width={16} />
                {timeFrame == TimeFrame.Custom && (
                  <span>
                    {dayjs(from).format("MMM D,  YYYY")} -{" "}
                    {dayjs(to).format("MMM D,  YYYY")}
                  </span>
                )}
              </>
            ) : (
              value
            )}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5 mb-5">
            <div className="border bg-white rounded-2xl  flex flex-col gap-2 w-full row-span-2 py-6 pb-0  dash-card">
              <p className="px-5 font-bold">Sales</p>
              <div className="pb-3 px-6 pt-2 h-52">
                <SalesChart
                  data={enumerate(timeFrame, result.salesChart, {
                    start: from,
                    end: to,
                  }).map((e) => ({
                    name: format(timeFrame, e.label),
                    value: e.value,
                  }))}
                />
              </div>
            </div>

            <div className="border bg-white rounded-2xl  flex flex-col gap-2 w-full row-span-2 py-6 pb-0  dash-card">
              <p className="px-5 font-bold">Orders</p>
              <div className="pb-3 px-6 pt-2  h-52">
                <SalesChart
                  data={enumerate(timeFrame, result.orderChart, {
                    start: from,
                    end: to,
                  }).map((e) => ({
                    name: format(timeFrame, e.label),
                    value: e.value,
                  }))}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
