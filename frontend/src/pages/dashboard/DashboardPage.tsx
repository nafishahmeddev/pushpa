import Formatter from "@app/lib/formatter";
import DashboardApi from "@app/services/dashboard";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [result, setResult] = useState({
    sales: 0,
    orders:0
  })

  const fetchStats = () => DashboardApi.stats().then(setResult);
  useEffect(()=>{
    fetchStats();
  },[])
  return (
    <div className="h-full p-4 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 grid-rows-[100px] gap-3 items-start">
      <div className="border bg-white rounded-xl h-full p-4 flex flex-col gap-2 w-full">
        <p>Today's Sales</p>
        <span className="text-2xl text-purple-700">{Formatter.money(result.sales)}</span>
      </div>
      <div className="border bg-white rounded-xl h-full p-4 flex flex-col gap-2 w-full">
        <p>Today's Orders</p>
        <span className="text-2xl text-purple-700">{result.orders}</span>
      </div>
    </div>
  );
}
