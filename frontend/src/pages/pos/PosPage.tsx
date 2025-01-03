import OrdersApi from "@app/services/orders";
import { OrderType, IOrder } from "@app/types/orders";
import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate, useParams } from "react-router";
import { Icon } from "@iconify/react";
import NewOrderModal from "./components/NewOrderModal";
export default function PosPage() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { orderId: pOrderId } = useParams<{ orderId: string }>();
  const [orders, setOrders] = useState<Array<IOrder>>([]);
  const [newOrderModal, setNewOrderModal] = useState<{
    open: boolean;
    order?: IOrder;
  }>({
    open: false,
  });

  const refresh = () => {
    const promise = OrdersApi.pendingList();
    return promise;
  };

  const handleOnNew = (item: IOrder) => {
    if (!orders.map((e) => e.id).includes(pOrderId as string)) {
      navigate("/pos/" + item.id);
    }
    setOrders((orders) => [...orders, item]);
    setNewOrderModal({ open: false });
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
        }
      });
    } else if (pathname.startsWith("/pos")) {
      init();
    }
  }, [pathname, navigate]);
  return (
    <React.Fragment>
      <NewOrderModal {...newOrderModal} onSave={handleOnNew} onReset={() => setNewOrderModal({ open: false })} />

      <div className="h-full grid grid-cols-[120px_1fr] m-auto p-4 gap-4">
        <div className="flex flex-col h-full gap-2 ">
          {orders.map((order) => (
            <div key={`order-item-${order.id}`} className="relative">
              <NavLink
                to={"/pos/" + order.id}
                className={({ isActive }) =>
                  `rounded-xl py-2 flex  items-center justify-start flex-nowrap text-nowrap px-3 gap-2  hover:opacity-50  border transition-all cursor-pointer
              text-sm overflow-hidden
            ${isActive ? "bg-lime-600/10 text-lime-800 border-transparent" : "bg-white"}`
                }
              >
                {order.type == OrderType.Takeaway ? (
                  <>
                    <Icon icon="ri:takeaway-line" width={16} height={16} />
                    <span className="flex-1 overflow-ellipsis w-full overflow-x-hidden text-sm">{[order.orderNo].filter((e) => !!e).join(":")} </span>
                  </>
                ) : (
                  <>
                    <Icon icon="fluent:couch-12-regular" width={16} height={16} />
                    <span className="flex-1 overflow-ellipsis w-full overflow-x-hidden text-sm">{[order.table?.name].filter((e) => !!e).join(":")} </span>
                  </>
                )}
              </NavLink>
            </div>
          ))}
          <button
            onClick={() => setNewOrderModal({ open: true })}
            className={`rounded-xl py-2 flex  items-center justify-start flex-nowrap text-nowrap px-3 gap-2  hover:opacity-50  border transition-all cursor-pointer
              text-sm bg-white`}
          >
            <Icon icon="gala:add" /> New Order
          </button>
        </div>
        <div className="h-full grid grid-cols-[auto_1fr]  m-auto w-full overflow-auto gap-4 select-none">
          <Outlet />
        </div>
      </div>
    </React.Fragment>
  );
}
