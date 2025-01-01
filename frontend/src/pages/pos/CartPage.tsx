import Formatter from "@app/lib/formatter";
import QuantityButton from "./components/QuantityButton";
import React, { useEffect, useState } from "react";

import OrdersApi from "@app/services/orders";
import { cloneDeep } from "lodash";
import CartUtil from "@app/lib/cart-util";
import MenuList from "@app/components/menu/MenuList";
import ScrollView from "@app/components/ui/ScrollView";
import { beep } from "@app/lib/notify";
import { useNavigate, useParams } from "react-router";
import { AxiosError } from "axios";
import { Icon } from "@iconify/react";
import Button from "@app/components/ui/form/button";
import { ICart, ICartItem } from "@app/types/cart";
import { IOrder } from "@app/types/orders";
import { IInvoice } from "@app/types/invoice";
import toast from "react-hot-toast";

export default function CartPage() {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const [cart, setCart] = useState<ICart>({ items: [], name: "" });
  const { items } = cart;
  const cartUtil = new CartUtil(items);
  const onAdd = async (item: ICartItem) => {
    beep();
    setCart((cart) => {
      let { items } = cloneDeep(cart);
      if (items.some((ci) => ci.productId == item.productId)) {
        items = items.map((ci) => {
          if (ci.productId == item.productId) {
            ci.quantity += 1;
          }
          return ci;
        });
      } else {
        items.push(item);
      }
      return { ...cart, items };
    });
  };

  const onRemove = async (item: ICartItem) => {
    beep();
    setCart((cart) => {
      let { items } = cloneDeep(cart);
      if (items.some((ci) => ci.productId == item.productId)) {
        items = items
          .map((ci) => {
            if (ci.productId == item.productId) {
              ci.quantity -= 1;
            }
            return ci;
          })
          .filter((item) => !!item.quantity);
      }
      return { ...cart, items };
    });
  };

  const onUpdate = async (item: ICartItem, quantity: number) => {
    beep();
    setCart((cart) => {
      let { items } = cloneDeep(cart);
      items = items
        .map((ci) => {
          if (ci.productId == item.productId) {
            ci.quantity = quantity;
          }
          return ci;
        })
        .filter((item) => !!item.quantity);
      return { ...cart, items };
    });
  };

  const onPlaceOrder = () => {
    const promise = OrdersApi.place({ id: orderId, ...cart }).then((invoice: IInvoice) => {
      const w = window.open(import.meta.env.VITE_BASE_URL + `/invoices/${invoice.id}/receipt?authorization=${localStorage.getItem("accessToken")}`, "_blank", "location=yes,height=600,width=350,scrollbars=yes,status=yes");

      if (w) {
        setTimeout(function () {
          w.document.close();
          w.focus();
          w.print();
          w.close();
        }, 1000);
      }
      setCart({ items: [], name: "" });
      navigate("/pos");
    });
    toast.promise(promise, {
      loading: "Please wait",
      success: "Order placed",
      error: "Error while placing order",
    });
  };

  const onDraft = () => {
    if (!items.length) return alert("please add some products!");
    const name = prompt("Name", cart.name);
    if (!name) return;
    let promise;
    if (orderId) {
      promise = OrdersApi.update(orderId, { ...cart, name: name as string });
    } else {
      promise = OrdersApi.create({ ...cart, name: name as string });
    }
    toast.promise(promise, {
      loading: "Please wait",
      success: "Draft saved",
      error: "Error while drafting order",
    });
    return promise
      .then((order: IOrder) => {
        navigate("/pos/" + order.id);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  useEffect(() => {
    OrdersApi.get(orderId as string)
      .then((res) => {
        setCart(res as ICart);
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
            onAdd({
              productId: item.id,
              product: item,
              quantity: 1,
              price: item.price,
            })
          }
        />
      </div>
      <div className="h-full overflow-auto grid grid-rows-[1fr_auto_auto] w-full ">
        <ScrollView className="h-full w-full overflow-auto rounded-t-xl border border-b-0 bg-white">
          <table className="w-full ">
            <thead>
              <tr className="bg-gray-100 sticky top-0">
                <th className="px-2 py-2 text-start w-0">#</th>
                <th className="px-2 py-2 text-start">Item</th>
                <th className="px-2 py-2 text-end w-0">Price</th>
                <th className="px-2 py-2 text-center w-0">Qtd.</th>
                <th className="px-2 py-2 text-end w-0">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr className="border-b border-dashed" key={`item-${index}`}>
                  <td className="px-2 py-1 text-start">{index + 1}</td>
                  <td className="px-2 py-1 text-start">{item.product.name}</td>
                  <td className="px-2 py-2 text-end font-mono">{Formatter.money(item.product.price)}</td>
                  <td className="px-10 py-0.5 text-center w-0">
                    <QuantityButton quantity={item.quantity} onAdd={() => onAdd(item)} onRemove={() => onRemove(item)} onUpdate={(quantity) => onUpdate(item, quantity)} />
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
        <div className="h-full flex gap-1 pt-2">
          <div className="flex-1"></div>
          <Button className="bg-gray-50 border  h-auto !px-3 py-1.5 text-sm" onClick={onDraft} disabled={items.length == 0}>
            <Icon icon="fluent:money-16-regular" height={18} width={18} /> Draft
          </Button>
          <Button className="bg-lime-600 h-auto !px-3 text-white  disabled:bg-gray-300 disabled:opacity-100 text-sm" onClick={onPlaceOrder} disabled={items.length == 0}>
            <Icon icon="fluent:money-16-regular" height={18} width={18} /> Create Receipt & Pay
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
}
