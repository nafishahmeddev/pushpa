import Formatter from "@app/lib/formatter";
import QuantityButton from "./components/QuantityButton";
import React, { useEffect, useState } from "react";

import OrdersApi from "@app/services/orders";
import CartUtil from "@app/lib/cart-util";
import MenuList from "@app/components/menu/MenuList";
import ScrollView from "@app/components/ui/ScrollView";
import { beep } from "@app/lib/notify";
import { useNavigate, useParams } from "react-router";
import { AxiosError } from "axios";
import { Icon } from "@iconify/react";
import Button from "@app/components/ui/form/button";
import { IInvoice } from "@app/types/invoice";
import toast from "react-hot-toast";
import { ICartItem } from "@app/types/cart";
import { IOrder, IOrderItem } from "@app/types/orders";
import { cloneDeep } from "lodash";

export default function CartPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const [, setOrder] = useState<IOrder>();
  const [placedItems, setPlacedItems] = useState<Array<IOrderItem>>([]);
  const [items, setItems] = useState<Array<ICartItem>>([]);

  const cartUtil = new CartUtil(items);
  const onModify = async (item: ICartItem, increment: boolean = false) => {
    const _items = cloneDeep(items);
    const itm = _items.find((e) => e.productId == item.productId);
    item.quantity = increment ? (itm?.quantity ?? 0) + item.quantity : item.quantity;
    OrdersApi.modifyItem(orderId as string, item).then(() => {
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
    });
  };

  const onCancel = async (item: IOrderItem) =>
    OrdersApi.cancelItem(orderId as string, item.id).then(() => {
      beep();
    });

  const onDelete = async (item: ICartItem) =>
    OrdersApi.deleteItem(orderId as string, item.productId).then(() => {
      setItems((_items: Array<ICartItem>) => {
        return _items.filter((e) => e.productId != item.productId);
      });
      beep();
    });

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

  useEffect(() => {
    OrdersApi.getOrder(orderId as string)
      .then((res) => {
        setOrder(res);
        setItems((res.items ?? []).filter((e) => !e.kotId));
        setPlacedItems((res.items ?? []).filter((e) => !!e.kotId));
      })
      .catch((err: AxiosError) => {
        if (err.status == 404) {
          navigate("/pos");
        }
      });
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
        <div className="h-full flex gap-1 pb-2">
          <div className="flex-1"></div>
          <Button className="bg-gray-50 border  h-auto !px-3 py-1.5 text-sm" disabled={items.length == 0 || loading}>
            <Icon icon="hugeicons:kitchen-utensils" height={18} width={18} /> Send to kitchen
          </Button>
          <Button className="bg-lime-600 h-auto !px-3 text-white  disabled:bg-gray-300 disabled:opacity-100 text-sm" onClick={onPlaceOrder} disabled={items.length == 0 || loading}>
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
              {placedItems.map((item, index) => (
                <tr className="border-b border-dashed" key={`item-${index}`}>
                  <td className="px-2 py-1 text-start">{item.product.name}</td>
                  <td className="px-2 py-2 text-end font-mono">{Formatter.money(item.product.price)}</td>
                  <td className="px-10 py-0.5 text-center w-0">
                    {item.quantity} <button onClick={() => onCancel(item)}>C</button>
                  </td>
                  <td className="px-2 py-1 text-end font-mono">{Formatter.money(item.product.price * item.quantity)}</td>
                </tr>
              ))}
              {items.map((item, index) => (
                <tr className="border-b border-dashed" key={`item-${index}`}>
                  <td className="px-2 py-1 text-start">{item.product.name}</td>
                  <td className="px-2 py-2 text-end font-mono">{Formatter.money(item.product.price)}</td>
                  <td className="px-10 py-0.5 text-center w-0">
                    <QuantityButton quantity={item.quantity} onUpdate={(quantity) => onModify({ ...item, quantity })} onDelete={() => onDelete(item)} />
                  </td>
                  <td className="px-2 py-1 text-end font-mono">{Formatter.money(item.product.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length == 0 && (
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
