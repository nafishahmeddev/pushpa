import Formatter from "@app/lib/formatter";
import QuantityButton from "./components/QuantityButton";
import React, { useEffect, useState } from "react";
import { ICartItem } from "@app/types/cart";
import { useNavigate, useParams } from "react-router";
import CartsApi from "@app/services/carts";
import { cloneDeep } from "lodash";
import CartUtil from "@app/lib/cart";
import MenuList from "@app/components/menu/MenuList";
import { IOrder } from "@app/types/order";
import ScrollView from "@app/components/ui/ScrollView";
import { AxiosError } from "axios";
import { beep } from "@app/lib/notify";
export default function CartDetailsPage() {
  const navigate = useNavigate();
  const { cartId } = useParams<{ cartId: string }>();
  const [items, setItems] = useState<Array<ICartItem>>([]);
  const cartUtil = new CartUtil(items);
  const onAdd = (item: ICartItem) => {
    return CartsApi.addItem(cartId as string, {
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

  const onRemove = (item: ICartItem) => {
    return CartsApi.delItem(cartId as string, {
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

  const onUpdate = (item: ICartItem, quantity: number) => {
    return CartsApi.updateItem(cartId as string, {
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
      CartsApi.place(cartId as string)
        .then((order: IOrder) => {
          window.open(
            import.meta.env.VITE_BASE_URL +
              `/orders/${order.id}/receipt?authorization=${localStorage.getItem(
                "accessToken"
              )}`,
            "_blank",
            "location=yes,height=600,width=350,scrollbars=yes,status=yes"
          );
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
    CartsApi.get(cartId as string)
      .then((res) => {
        setItems(res.items as Array<ICartItem>);
      })
      .catch((err: AxiosError) => {
        if (err.status == 404) {
          navigate("/pos");
        }
      });
  }, [cartId, navigate]);

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
        {/* <div className="">
          <Select>
            <option value="">Table</option>
          </Select>
        </div> */}
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
              <p className="text-sm">Cart is empty please add some item.</p>
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
            className="h-full bg-blue-800 hover:opacity-80 text-white rounded-xl px-6"
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
