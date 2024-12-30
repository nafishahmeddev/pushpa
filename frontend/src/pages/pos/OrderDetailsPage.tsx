import Formatter from "@app/lib/formatter";
import QuantityButton from "./components/QuantityButton";
import React, { useEffect, useState } from "react";
import { IOrderItem } from "@app/types/orders";
import { useNavigate, useParams } from "react-router";
import OrdersApi from "@app/services/orders";
import { cloneDeep } from "lodash";
import OrderUtil from "@app/lib/order";
import MenuList from "@app/components/menu/MenuList";
import { IInvoice } from "@app/types/invoice";
import ScrollView from "@app/components/ui/ScrollView";
import { AxiosError } from "axios";
import { beep } from "@app/lib/notify";
export default function OrderDetailsPage() {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const [items, setItems] = useState<Array<IOrderItem>>([]);
  const cartUtil = new OrderUtil(items);
  const onAdd = (item: IOrderItem) => {
    return OrdersApi.addItem(orderId as string, {
      productId: item.productId,
    }).then(() => {
      beep();
      setItems((_items) => {
        _items = cloneDeep(_items);
        if (_items.some((ci) => ci.productId == item.productId)) {
          _items = _items.map((ci) => {
            if (ci.productId == item.productId) {
              ci.quantity += 1;
            }
            return ci;
          });
        } else {
          _items.push(item);
        }
        return _items;
      });
    });
  };

  const onRemove = (item: IOrderItem) => {
    return OrdersApi.delItem(orderId as string, {
      productId: item.productId,
    }).then(() => {
      beep();
      setItems((_items) => {
        _items = cloneDeep(_items);
        if (_items.some((ci) => ci.productId == item.productId)) {
          _items = _items
            .map((ci) => {
              if (ci.productId == item.productId) {
                ci.quantity -= 1;
              }
              return ci;
            })
            .filter((item) => !!item.quantity);
        }
        return _items;
      });
    });
  };

  const onUpdate = (item: IOrderItem, quantity: number) => {
    return OrdersApi.updateItem(orderId as string, {
      productId: item.productId,
      quantity,
    }).then(() => {
      beep();
      setItems((_items) => {
        _items = cloneDeep(_items);
        _items = _items
          .map((ci) => {
            if (ci.productId == item.productId) {
              ci.quantity = quantity;
            }
            return ci;
          })
          .filter((item) => !!item.quantity);
        return _items;
      });
    });
  };

  const onPlaceOrder = () => {
    if (items.length) {
      OrdersApi.place(orderId as string)
        .then((invoice: IInvoice) => {
          const w = window.open(
            import.meta.env.VITE_BASE_URL +
              `/invoices/${invoice.id}/receipt?authorization=${localStorage.getItem(
                "accessToken"
              )}`,
            "_blank",
            "location=yes,height=600,width=350,scrollbars=yes,status=yes"
          );

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
        .catch((err) => {
          alert(err.message);
        });
    } else {
      alert("please add some products!");
    }
  };

  useEffect(() => {
    OrdersApi.get(orderId as string)
      .then((res) => {
        setItems(res.items as Array<IOrderItem>);
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
              id: "",
              productId: item.id,
              product: item,
              quantity: 1,
              price: item.price,
            })
          }
        />
      </div>
      <div className="h-full overflow-auto grid grid-rows-[1fr_auto_40px] gap-4 w-full ">
        <ScrollView className="h-full w-full overflow-auto rounded-2xl border bg-white">
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
                  <td className="px-2 py-2 text-end font-mono">
                    {Formatter.money(item.product.price)}
                  </td>
                  <td className="px-10 py-0.5 text-center w-0">
                    <QuantityButton
                      quantity={item.quantity}
                      onAdd={() => onAdd(item)}
                      onRemove={() => onRemove(item)}
                      onUpdate={(quantity) => onUpdate(item, quantity)}
                    />
                  </td>
                  <td className="px-2 py-1 text-end font-mono">
                    {Formatter.money(item.product.price * item.quantity)}
                  </td>
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
        <div className="h-full bg-white flex rounded-2xl border">
          <table>
            <tfoot>
              <tr>
                <td className="px-2 py-2 text-end">Tax:</td>
                <td className="px-2 py-2 text-end font-mono">
                  {Formatter.money(cartUtil.tax)}
                </td>
              </tr>
            </tfoot>
          </table>
          <div className="flex-1"></div>
          <table>
            <tfoot>
              <tr>
                <td className="px-2 py-1 text-end">Total</td>
                <td className="px-2 py-1 text-end font-mono">
                  {Formatter.money(cartUtil.total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="h-full flex gap-4">
          <div className="flex-1"></div>
          <button
            className="h-full bg-fuchsia-800 hover:opacity-80 text-white rounded-xl px-6 disabled:bg-gray-300 disabled:opacity-100"
            onClick={onPlaceOrder}
            disabled={items.length == 0}
          >
            Place Order
          </button>
        </div>
      </div>
    </React.Fragment>
  );
}
