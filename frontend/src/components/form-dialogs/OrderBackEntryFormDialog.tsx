import Dialog from "@app/components/ui/Dialog";
import Button from "@app/components/ui/form/button";
import Select from "@app/components/ui/form/select";
import OrdersApi from "@app/services/orders";
import TablesApi from "@app/services/tables";
import { ICartItem } from "@app/types/cart";
import { IOrder } from "@app/types/orders";
import { ITable } from "@app/types/table";
import { useForm } from "@tanstack/react-form";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Input from "../ui/form/input";
import MenuList from "../menu/MenuList";
import { cloneDeep } from "lodash";
import Formatter from "@app/lib/formatter";
import QuantityButton from "../QuantityButton";
import ScrollView from "../ui/ScrollView";
import CartUtil from "@app/lib/cart-util";

type ValueType = {
  tableId?: string;
  type: string;
  createdAt: string;
  discount: number;
};

type NewOrderModalProps = {
  open: boolean;
  onReset: () => void;
  onSave: (order: IOrder) => Promise<void> | void;
};

export default function OrderBackEntryFormDialog({
  open = false,
  onReset,
  onSave,
}: NewOrderModalProps) {
  const [tables, setTables] = useState<Array<ITable>>([]);
  const [items, setItems] = useState<Array<ICartItem>>([]);
  const cartUtil = new CartUtil([...items]);
  const form = useForm<ValueType>({
    defaultValues: {
      tableId: undefined,
      type: "Takeaway",
      createdAt: "",
      discount: 0,
    },
    onSubmit: async ({ value }) => {
      const promise = OrdersApi.backEntryOrder({ ...value, items });
      return promise
        .then((res: IOrder) => {
          form.reset();
          onSave(res);
        })
        .catch((err) => {
          toast.error(err.message);
        });
    },
  });

  const onModify = async (item: ICartItem, increment: boolean = false) => {
    const existingItem = items.find((e) => e.productId == item.productId);
    if (increment) {
      item.quantity = (existingItem?.quantity ?? 0) + item.quantity;
    }
    setItems((_items) => {
      _items = cloneDeep(items);
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
      return _items;
    });
  };

  const onDeleteItem = async (item: ICartItem) =>
    setItems((_items: Array<ICartItem>) => {
      return _items.filter((e) => e.productId != item.productId);
    });

  useEffect(() => {
    TablesApi.all().then((res) => {
      setTables(res);
    });
    form.reset();
    setItems([]);
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onReset}
      paperProps={{ className: "!max-w-[1000px]" }}
    >
      <form
        className="p-6 flex flex-col "
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <h3 className="text-xl">Create Order</h3>
        <fieldset className="flex flex-col gap-4">
          <div className="grid grid-cols-4 gap-4 mt-4">
            <form.Field
              name="createdAt"
              children={({ state, handleBlur, handleChange, name }) => (
                <Input
                  required
                  label="Date & Time"
                  type="datetime-local"
                  value={state.value}
                  onChange={(e) => handleChange(e.target.value)}
                  onBlur={handleBlur}
                  name={name}
                  error={state.meta.errors.join(" ")}
                  touched={state.meta.isTouched}
                />
              )}
            />

            <form.Field
              name="type"
              children={({ state, handleBlur, handleChange, name }) => (
                <Select
                  required
                  label="Type"
                  value={state.value}
                  onChange={(e) => {
                    handleChange(e.target.value);
                    if (e.target.value == "Takeaway") {
                      form.setFieldValue("tableId", undefined);
                    }
                  }}
                  onBlur={handleBlur}
                  name={name}
                  error={state.meta.errors.join(" ")}
                  touched={state.meta.isTouched}
                >
                  <option>Takeaway</option>
                  <option>Dine-In</option>
                </Select>
              )}
            />

            <form.Field
              name="tableId"
              validators={{
                onChangeListenTo: ["type"],
              }}
              children={({ state, handleBlur, handleChange, name, form }) => (
                <Select
                  label="Table"
                  value={state.value}
                  onChange={(e) => handleChange(e.target.value)}
                  onBlur={handleBlur}
                  name={name}
                  error={state.meta.errors.join(" ")}
                  touched={state.meta.isTouched}
                  disabled={form.state.values.type == "Takeaway"}
                  required={form.state.values.type == "Dine-In"}
                >
                  <option></option>
                  {tables.map((table) => (
                    <option
                      key={table.id}
                      value={table.id}
                      selected={state.value == table.id}
                    >
                      {table.name}
                    </option>
                  ))}
                </Select>
              )}
            />
            <form.Field
              name="discount"
              children={({ state, handleBlur, handleChange, name }) => (
                <Input
                  required
                  label="Discount"
                  type="number"
                  value={state.value ? state.value :""}
                  onChange={(e) => handleChange(Number(e.target.value))}
                  onBlur={handleBlur}
                  name={name}
                  error={state.meta.errors.join(" ")}
                  touched={state.meta.isTouched}
                  max={cartUtil.total}
                />
              )}
            />
          </div>

          <div className="h-[500px] grid grid-cols-[auto_1fr] gap-4">
            <div className="h-full overflow-auto bg-gray-50 rounded-xl border">
              <MenuList
                onItemPress={(item) =>
                  onModify(
                    {
                      productId: item.id,
                      product: item,
                      quantity: 1,
                      price: item.price,
                    },
                    true,
                  )
                }
              />
            </div>

            <div className="h-full overflow-auto grid grid-rows-[1fr_auto_auto]">
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
                    {items.map((item, index) => (
                      <tr
                        className="border-b border-dashed"
                        key={`item-${index}`}
                      >
                        <td className="px-2 py-1 text-start">
                          {item.product.name}
                        </td>
                        <td className="px-2 py-2 text-end font-mono text-gray-500">
                          {Formatter.money(item.product.price)}
                        </td>
                        <td className="px-4 py-0.5 text-center w-0">
                          <QuantityButton
                            quantity={item.quantity}
                            onUpdate={(quantity) =>
                              onModify({ ...item, quantity })
                            }
                            onDelete={() => onDeleteItem(item)}
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
              <form.Subscribe
                selector={(e) => e.values}
                children={({discount}) => (
                  <div className="h-full bg-white flex rounded-b-2xl border">
                    <table>
                      <tfoot>
                        <tr>
                          <td className="px-2 py-2 text-end">Tax:</td>
                          <td className="px-2 py-2 text-end font-mono font-bold">
                            {Formatter.money(cartUtil.tax)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>

                    <table>
                      <tfoot>
                        <tr>
                          <td className="px-2 py-2 text-end">Discount:</td>
                          <td className="px-2 py-2 text-end font-mono font-bold text-nowrap">
                            {Formatter.money(discount)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                    <div className="flex-1"></div>
                    <table>
                      <tfoot>
                        <tr>
                          <td className="px-2 py-1 text-end">Total:</td>
                          <td className="px-2 py-1 text-end font-mono font-bold">
                            {Formatter.money(cartUtil.total - discount)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
              />
            </div>
          </div>

          <form.Subscribe
            children={({ isSubmitting, canSubmit }) => (
              <div className="flex gap-2 justify-end">
                <Button
                  className=" bg-gray-300"
                  onClick={onReset}
                  type="button"
                >
                  Cancel
                </Button>
                <Button
                  className=" bg-lime-600 text-white"
                  type="submit"
                  disabled={!canSubmit}
                  loading={isSubmitting}
                >
                  Create
                </Button>
              </div>
            )}
          />
        </fieldset>
      </form>
    </Dialog>
  );
}
