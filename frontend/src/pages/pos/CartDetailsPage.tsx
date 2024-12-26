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
import { OrderReceipt } from "./components/OrderReceipt";
import ScrollView from "@app/components/ScrollView";
import { AxiosError } from "axios";
export default function CartDetailsPage() {
  const navigate = useNavigate();
  const { cartId } = useParams<{ cartId: string }>();
  const [items, setItems] = useState<Array<ICartItem>>([]);
  const cartUtil = new CartUtil(items);

  const [orderDialog, setOrderDialog] = useState<{
    open: boolean;
    order?: IOrder;
  }>({ open: false, order: undefined });

  const onAdd = (item: ICartItem) => {
    CartsApi.addItem(cartId as string, {
      productId: item.productId,
    }).then(() => {
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
    CartsApi.delItem(cartId as string, {
      productId: item.productId,
    }).then(() => {
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
    CartsApi.updateItem(cartId as string, {
      productId: item.productId,
      quantity,
    }).then(() => {
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
          setOrderDialog({ open: true, order });
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
      <dialog
        open={orderDialog.open}
        className=" open:bg-black/40  h-dvh w-dvw fixed top-0 left-0 z-10 overflow-auto"
      >
        <div className="bg-white w-[350px] m-auto shadow-sm my-2">
          <div className="flex">
            <button
              className="flex-1 py-2 bg-rose-800 text-white hover:opacity-50"
              onClick={() => {
                navigate("/pos");
              }}
            >
              Close
            </button>
            <button
              className="flex-1 py-2 bg-emerald-800 text-white hover:opacity-50"
              onClick={() => {
                const el = document.getElementById("order_details");
                console.log(el);
              }}
            >
              Print
            </button>
          </div>
          <div id="order_details">
            {orderDialog.order && <OrderReceipt order={orderDialog.order} />}
          </div>
        </div>
      </dialog>

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
                <th className="px-2 py-2 text-start">#</th>
                <th className="px-2 py-2 text-start">Item</th>
                <th className="px-2 py-2 text-end">Price</th>
                <th className="px-2 py-2 text-center">Qtd.</th>
                <th className="px-2 py-2 text-end">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr className="border-b border-dashed" key={`item-${index}`}>
                  <td className="px-2 py-1 text-start">{index + 1}</td>
                  <td className="px-2 py-1 text-start">{item.product.name}</td>
                  <td className="px-2 py-1 text-end font-mono">
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
          <button className="flex-1 h-full bg-rose-800 hover:opacity-80 text-white rounded-xl">
            Cancel
          </button>

          <button
            className="flex-1 h-full bg-emerald-800 hover:opacity-80 text-white rounded-xl"
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
