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
    <div className="h-full p-4 grid grid-cols-4 grid-rows-[100px] gap-3 items-start">
      <div className="border bg-white rounded-xl max-w-sm h-full p-4 flex flex-col gap-2">
        <p>Today's Sales</p>
        <span className="text-2xl text-blue-700">{Formatter.money(result.sales)}</span>
      </div>
      <div className="border bg-white rounded-xl max-w-sm h-full p-4 flex flex-col gap-2">
        <p>Today's Orders</p>
        <span className="text-2xl text-blue-700">{result.orders}</span>
      </div>
    </div>
  );
}
