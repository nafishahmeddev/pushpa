import OrdersApi from "@app/services/orders";
import { DeliverType, IOrder } from "@app/types/orders";
import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate, useParams } from "react-router";
import { Icon } from "@iconify/react";
import { cloneDeep } from "lodash";
import NewOrderModal from "./components/NewOrderModal";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import Button from "@app/components/ui/form/button";
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

  const handleOnDelete = (orderId: string) => {
    const promise = OrdersApi.deleteOrder(orderId).then(() => {
      setOrders((items) => items.filter((e) => e.id != orderId));
      const items = cloneDeep(orders).filter((e) => e.id != orderId);
      if (!items.length || !items.map((e) => e.id).includes(pOrderId as string)) {
        navigate("/pos");
      }
    });
    toast.promise(promise, {
      success: "Successfully deleted",
      error: (err: AxiosError) => err.message,
      loading: "Deleting..",
    });
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
                {order.deliveryType == DeliverType.Takeaway ? (
                  <>
                    <Icon icon="ri:takeaway-line" width={16} height={16} />
                    <span className="flex-1 overflow-ellipsis w-full overflow-x-hidden text-sm">{[order.orderNo].filter((e) => !!e).join(":")} </span>
                  </>
                ) : (
                  <>
                    <Icon icon="fluent:couch-12-regular"  width={16} height={16} />
                    <span className="flex-1 overflow-ellipsis w-full overflow-x-hidden text-sm">{[order.table?.name].filter((e) => !!e).join(":")} </span>
                  </>
                )}
              </NavLink>
              <Button className="absolute right-0 top-0 flex items-center justify-center h-full pe-1.5 text-sm text-red-600 hover:opacity-50" onClick={() => handleOnDelete(order.id)} ask="Are you sure want to delete?">
                <Icon icon="fluent:delete-32-regular" />
              </Button>
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
