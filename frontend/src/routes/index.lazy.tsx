import Formatter from '@app/lib/formatter'
import DashboardApi from '@app/services/dashboard'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
export const Route = createLazyFileRoute('/')({ component: RouteComponent })

function RouteComponent() {
  const [result, setResult] = useState<{
    tax: number
    netSales: number
    revenue: number
    averageOrder: number
    orders: number
    topSellingItems: Array<{
      name: string
      count: number
    }>
  }>({
    tax: 0,
    netSales: 0,
    revenue: 0,
    averageOrder: 0,
    orders: 0,
    topSellingItems: [],
  })

  const fetchStats = () => DashboardApi.stats().then(setResult)
  useEffect(() => {
    fetchStats()
  }, [])
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 py-6 ">
      <div className="border bg-white rounded-2xl h-60 flex flex-col gap-2 w-full row-span-2 py-6  dash-card">
        <p className="px-5 font-bold">Top Selling Items</p>
        <div className="px-5 flex-1 ">
          <table className="w-full">
            <tbody>
              {result.topSellingItems.map((item, i) => (
                <tr key={i}>
                  <td className="py-1">{item.name}</td>
                  <td className="w-0 text-gray-700 py-1 ">
                    {item.count}
                  </td>
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
  )
}
