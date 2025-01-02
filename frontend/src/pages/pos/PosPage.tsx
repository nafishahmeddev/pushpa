import OrdersApi from "@app/services/orders";
import { IOrder } from "@app/types/orders";
import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate, useParams } from "react-router";
import { Icon } from "@iconify/react";
import { cloneDeep } from "lodash";
export default function PosPage() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { orderId: pOrderId } = useParams<{ orderId: string }>();
  const [orders, setOrders] = useState<Array<IOrder>>([]);

  const refresh = () => {
    const promise = OrdersApi.pendingList();
    return promise;
  };

  const handleOnDelete = (orderId: string) =>
    OrdersApi.deleteOrder(orderId)
      .then(() => {
        setOrders((items) => items.filter((e) => e.id != orderId));
        const items = cloneDeep(orders).filter((e) => e.id != orderId);
        if (!items.length || !items.map((e) => e.id).includes(pOrderId as string)) {
          navigate("/pos");
        }
      })
      .catch((err) => {
        alert(err.message);
      });
  const handleOnNew = () => {
    return OrdersApi.newOrder()
      .then((item) => {
        if (!orders.map((e) => e.id).includes(pOrderId as string)) {
          navigate("/pos/" + item.id);
        }
        setOrders((orders) => [...orders, item]);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  useEffect(() => {
    const init = () =>
      refresh().then((_items) => {
        setOrders(_items);
        return _items;
      });

    if (pathname == "/pos") {
      init().then((_items) => {
        if (_items.length) {
          navigate("/pos/" + _items[0].id);
        } else {
          handleOnNew();
        }
      });
    } else if (pathname.startsWith("/pos")) {
      init();
    }
  }, [pathname, navigate]);
  return (
    <div className="h-full grid grid-cols-[120px_1fr] m-auto p-4 gap-4">
      <div className="flex flex-col h-full gap-2 ">
        {orders.map((order, index) => (
          <div key={`order-item-${order.id}`} className="relative">
            <NavLink
              to={"/pos/" + order.id}
              className={({ isActive }) =>
                `rounded-xl py-2 flex  items-center justify-start flex-nowrap text-nowrap px-3 gap-2  hover:opacity-50  border transition-all cursor-pointer
              text-sm overflow-hidden
            ${isActive ? "bg-lime-600/10 text-lime-800 border-transparent" : "bg-white"}`
              }
            >
              <span className="flex-1 overflow-ellipsis w-full overflow-x-hidden">#{index}</span>
            </NavLink>
            <button className="absolute right-0 top-0 flex items-center justify-center h-full pe-1.5 text-sm text-red-600 hover:opacity-50" onClick={() => handleOnDelete(order.id)}>
              <Icon icon="fluent:delete-32-regular" />
            </button>
          </div>
        ))}
        <button
          onClick={handleOnNew}
          className={`rounded-xl py-2 flex  items-center justify-start flex-nowrap text-nowrap px-3 gap-2  hover:opacity-50  border transition-all cursor-pointer
              text-sm bg-white`}
        >
          <Icon icon="ic:baseline-add" /> New Cart
        </button>
      </div>
      <div className="h-full grid grid-cols-[auto_1fr]  m-auto w-full overflow-auto gap-4 select-none">
        <Outlet />
      </div>
    </div>
  );
}
