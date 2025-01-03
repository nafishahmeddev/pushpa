import Formatter from "@app/lib/formatter";
import QuantityButton from "./components/QuantityButton";
import React, { useEffect, useState } from "react";

import OrdersApi from "@app/services/orders";
import CartUtil from "@app/lib/cart-util";
import MenuList from "@app/components/menu/MenuList";
import ScrollView from "@app/components/ui/ScrollView";
import { beep } from "@app/lib/notify";
import { useNavigate, useParams } from "react-router";
import { Icon } from "@iconify/react";
import Button from "@app/components/ui/form/button";
import { IInvoice } from "@app/types/invoice";
import toast from "react-hot-toast";
import { ICartItem } from "@app/types/cart";
import { IKot, IOrder, IOrderItem, OrderItemStatus, OrderStatus } from "@app/types/orders";
import { cloneDeep } from "lodash";

export default function CartPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<IOrder>();
  const [placedItems, setPlacedItems] = useState<Array<IOrderItem>>([]);
  const [items, setItems] = useState<Array<ICartItem>>([]);

  const cartUtil = new CartUtil([...items, ...placedItems.filter((e) => e.status != OrderItemStatus.Cancelled)]);

  const init = () =>
    OrdersApi.getOrder(orderId as string).then((res) => {
      setOrder(res);
      setItems((res.items ?? []).filter((e) => !e.kotId));
      setPlacedItems((res.items ?? []).filter((e) => !!e.kotId));
    });
  const onModify = async (item: ICartItem, increment: boolean = false) => {
    const _items = cloneDeep(items);
    const itm = _items.find((e) => e.productId == item.productId);
    item.quantity = increment ? (itm?.quantity ?? 0) + item.quantity : item.quantity;
    const _toast = toast.loading("Please wait..");
    OrdersApi.modifyItem(orderId as string, item)
      .then(() => {
        beep();
        if (_items.some((i) => i.productId == item.productId)) {
          _items.map((itm) => {
            if (itm.productId == item.productId) {
              itm.quantity = item.quantity;
            }
            return itm;
          });
        } else {
          _items.push(item);
        }
        setItems(_items);
      })
      .finally(() => {
        toast.dismiss(_toast);
      });
  };

  const onCancelItem = async (item: IOrderItem) =>
    OrdersApi.cancelItem(orderId as string, item.id).then(() => {
      beep();
      setPlacedItems((items) => {
        return items.map((_item) => {
          if (_item.id == item.id) {
            _item.status = OrderItemStatus.Cancelled;
          }
          return _item;
        });
      });
    });

  const onDeleteItem = async (item: ICartItem) =>
    OrdersApi.deleteItem(orderId as string, item.productId).then(() => {
      setItems((_items: Array<ICartItem>) => {
        return _items.filter((e) => e.productId != item.productId);
      });
      beep();
    });

  const onCancel = () => {
    const promise = OrdersApi.cancelOrder(orderId as string).then(() => {
      navigate("/pos");
    });
    toast.promise(promise, {
      loading: "please wait..",
      success: "Order cancelled",
      error: (err) => err.message,
    });
    return promise;
  };

  const onDelete = () => {
    const promise = OrdersApi.deleteOrder(orderId as string).then(() => {
      navigate("/pos");
    });
    toast.promise(promise, {
      loading: "please wait..",
      success: "Order cancelled",
      error: (err) => err.message,
    });
    return promise;
  };

  const onPlaceOrder = () => {
    setLoading(true);
    const promise = OrdersApi.completeOrder(orderId as string)
      .then((invoice: IInvoice) => {
        const w = window.open(import.meta.env.VITE_BASE_URL + `/invoices/${invoice.id}/receipt?authorization=${localStorage.getItem("accessToken")}`, "_blank", "location=yes,height=600,width=350,scrollbars=yes,status=yes");
        if (w) {
          setTimeout(function () {
            w.document.close();
            w.focus();
            w.print();
            w.close();
          }, 1000);
        }
        navigate("/pos");
      })
      .finally(() => {
        setLoading(false);
      });
    toast.promise(promise, {
      loading: "Please wait",
      success: "Order placed",
      error: "Error while placing order",
    });
  };

  const printKot = (kot: IKot) => {
    const w = window.open(import.meta.env.VITE_BASE_URL + `/orders/${orderId}/kots/${kot.id}/print?authorization=${localStorage.getItem("accessToken")}`, "_blank", "location=yes,height=600,width=350,scrollbars=yes,status=yes");
    if (w) {
      setTimeout(function () {
        w.document.close();
        w.focus();
        w.print();
        w.close();
      }, 1000);
    }
  };

  const onCreateKot = () => {
    setLoading(true);
    const promise = OrdersApi.createKot(orderId as string)
      .then((kot: IKot) => {
        printKot(kot);
        init();
      })
      .finally(() => {
        setLoading(false);
      });
    toast.promise(promise, {
      loading: "Please wait",
      success: "Order placed",
      error: "Error while placing order",
    });
  };

  const getKots = () => {
    const list = (order?.kotList ?? [])
      .map((kot) => {
        kot.items = placedItems.filter((item) => item.kotId == kot.id);
        return kot;
      })
      .sort((a, b) => (a.tokenNo < b.tokenNo ? -1 : 0));
    return list;
  };

  useEffect(() => {
    init();
  }, [orderId, navigate]);

  return (
    <React.Fragment>
      <div className="h-full overflow-auto">
        <MenuList
          className="border rounded-xl"
          onItemPress={(item) =>
            onModify(
              {
                productId: item.id,
                product: item,
                quantity: 1,
                price: item.price,
              },
              true
            )
          }
        />
      </div>
      <div className="h-full overflow-auto grid grid-rows-[auto_1fr_auto] w-full ">
        <div className="flex gap-1 pb-2 h-10 items-stretch">
          <div className="flex-1"></div>
          {placedItems.length > 0 && (
            <Button className="bg-white border text-red-600  disabled:opacity-50 text-sm !px-2.5 h-full" onClick={onCancel} disabled={loading} ask>
              <Icon icon="ep:remove" height={18} width={18} /> Cancel Order
            </Button>
          )}

          {order?.status == OrderStatus.Draft && !items.length && (
            <Button className="bg-white border text-red-600  disabled:opacity-50 text-sm !px-2.5 h-full" onClick={onDelete} disabled={loading} ask>
              <Icon icon="ep:remove" height={18} width={18} /> Delete Order
            </Button>
          )}
          <Button className="bg-white border text-gray-600 disabled:opacity-50 text-sm !px-2.5 h-full" onClick={onCreateKot} disabled={items.length == 0 || loading}>
            <Icon icon="hugeicons:kitchen-utensils" height={18} width={18} /> Send to kitchen
          </Button>
          <Button className="bg-lime-500 border border-transparent text-white disabled:opacity-50 text-sm !px-2.5 h-full" onClick={onPlaceOrder} disabled={[...placedItems, ...items].length == 0 || loading}>
            <Icon icon="fluent:money-16-regular" height={18} width={18} /> Pay & Complete
          </Button>
        </div>
        <ScrollView className="h-full w-full overflow-auto rounded-t-xl border border-b-0 bg-white">
          <table className="w-full ">
            <thead>
              <tr className="bg-gray-100 sticky top-0">
                <th className="px-2 py-2 text-start">Item</th>
                <th className="px-2 py-2 text-end w-0">Price</th>
                <th className="px-2 py-2 text-center w-0">Qtd.</th>
                <th className="px-2 py-2 text-end w-0">Total</th>
              </tr>
            </thead>
            <tbody>
              {getKots().map((kot: IKot) => (
                <React.Fragment key={`item-${kot.id}`}>
                  <tr className={`border-b border-dashed bg-lime-600 text-white`}>
                    <td className="px-2 py-1 text-start font-bold" colSpan={3}>
                      Token No: {kot.tokenNo}
                    </td>
                    <td className="text-white text-right px-2 w-0">
                      <div className="flex justify-end">
                        <button className="h-full flex items-center text-lg text-right" onClick={() => printKot(kot)}>
                          <Icon icon="uil:print" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {(kot.items ?? []).map((item, index) => (
                    <tr className={`border-b border-dashed ${item.status == OrderItemStatus.Cancelled ? "bg-red-50 line-through text-gray-500" : ""}`} key={`item-${index}`}>
                      <td className="px-2 py-1 text-start">{item.product.name}</td>
                      <td className="px-2 py-1.5 text-end font-mono text-gray-500">{Formatter.money(item.product.price)}</td>
                      <td className="px-4 py-0.5 text-center w-0 text-nowrap">
                        <div className={`grid grid-cols-[20px_30px_20px] gap-[4px] justify-center items-center ${loading ? "animate-pulse" : ""}`}>
                          <div></div>
                          <input className="text-center  font-mono flex-1 bg-transparent min-w-0 w-full flex appearance-none" value={item.quantity} readOnly />
                          <div>
                            {item.status != OrderItemStatus.Cancelled && (
                              <Button title="Cancel" className={`bg-red-600 !rounded-lg h-5 aspect-square flex items-center justify-center hover:opacity-50  text-white !px-0`} onClick={() => onCancelItem(item)} ask>
                                <Icon icon="ic:round-close" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-1 text-end font-mono">{Formatter.money(item.product.price * item.quantity)}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
              {items.map((item, index) => (
                <tr className="border-b border-dashed" key={`item-${index}`}>
                  <td className="px-2 py-1 text-start">{item.product.name}</td>
                  <td className="px-2 py-2 text-end font-mono text-gray-500">{Formatter.money(item.product.price)}</td>
                  <td className="px-4 py-0.5 text-center w-0">
                    <QuantityButton quantity={item.quantity} onUpdate={(quantity) => onModify({ ...item, quantity })} onDelete={() => onDeleteItem(item)} />
                  </td>
                  <td className="px-2 py-1 text-end font-mono">{Formatter.money(item.product.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length == 0 && placedItems.length == 0 && (
            <div className="p-6 flex items-center justify-center h-[calc(100%-50px)] flex-col gap-3">
              <img src="/undraw_notify_rnwe.svg" width={120} />
              <p className="text-sm">Order is empty please add some item.</p>
            </div>
          )}
        </ScrollView>
        <div className="h-full bg-white flex rounded-b-2xl border">
          <table>
            <tfoot>
              <tr>
                <td className="px-2 py-2 text-end">Tax:</td>
                <td className="px-2 py-2 text-end font-mono font-bold">{Formatter.money(cartUtil.tax)}</td>
              </tr>
            </tfoot>
          </table>
          <div className="flex-1"></div>
          <table>
            <tfoot>
              <tr>
                <td className="px-2 py-1 text-end">Total:</td>
                <td className="px-2 py-1 text-end font-mono font-bold">{Formatter.money(cartUtil.total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </React.Fragment>
  );
}
