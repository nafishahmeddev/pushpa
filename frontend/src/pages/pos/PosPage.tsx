import Formatter from "@app/lib/formatter";
import OrdersApi from "@app/services/orders";
import { IOrder } from "@app/types/orders";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router";
import {Icon}from "@iconify/react";
export default function PosPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState<Array<IOrder>>([]);

  const refresh = () => {
    const promise = OrdersApi.drafts();
    return promise;
  };
  const handleNewOrder = () => {
    const promise = OrdersApi.create()
      .then((item) => {
        navigate("/pos/" + item.id);
        refresh().then(setOrders);
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
    toast.promise(promise, {
      loading: "please wait...",
      success: 'successful',
      error: 'something went wrong!',
    });
  };

  useEffect(() => {
    if (location.pathname == "/pos") {
      refresh().then((_items) => {
        setOrders(_items);
        if (_items.length) {
          navigate("/pos/" + _items[0].id);
        } else {
          handleNewOrder();
        }
      });
    } else if (location.pathname.startsWith("/pos")) {
      refresh().then((_items) => {
        setOrders(_items);
      });
    }
  }, [location.pathname, navigate]);
  return (
    <div className="h-full grid grid-rows-[35px_1fr] m-auto p-4 gap-4">
      <div className="flex flex-row h-full gap-2 ">
        {orders.map((order, index) => (
          <NavLink
            key={`order-item-${order.id}`}
            to={"/pos/" + order.id}
            className={({ isActive }) =>
              `rounded-xl py-3 flex  items-center justify-between flex-nowrap text-nowrap px-3 gap-2  hover:opacity-50  border transition-all cursor-pointer
              text-sm  
            ${isActive ? "bg-fuchsia-600/10 text-fuchsia-800 border-transparent" : "bg-white"}`
            }
          >
            <strong className="">{index + 1}</strong>
            <span>{Formatter.time(order.createdAt)}</span>
          </NavLink>
        ))}

        <button
          className="rounded-xl py-3 flex  items-center justify-between flex-nowrap text-nowrap px-3 gap-2  hover:opacity-50  border transition-all cursor-pointer
              text-sm bg-white"
          onClick={handleNewOrder}
        >
          <Icon icon="ic:baseline-add"/>
        </button>
      </div>
      <div className="h-full grid grid-cols-[auto_1fr]  m-auto w-full overflow-auto gap-4 select-none">
        <Outlet />
      </div>
    </div>
  );
}
