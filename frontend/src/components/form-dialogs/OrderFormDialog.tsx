import Dialog from "@app/components/ui/Dialog";
import Button from "@app/components/ui/form/button";
import Select from "@app/components/ui/form/select";
import OrdersApi from "@app/services/orders";
import TablesApi from "@app/services/tables";
import { IOrder } from "@app/types/orders";
import { ITable } from "@app/types/table";
import { useForm } from "@tanstack/react-form";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type ValueType = {
  tableId?: string;
  type: string;
};

type NewOrderModalProps = {
  open: boolean;
  order?: IOrder;
  onReset: () => void;
  onSave: (order: IOrder) => Promise<void> | void;
};

export default function OrderFormDialog({
  open = false,
  order,
  onReset,
  onSave,
}: NewOrderModalProps) {
  const [tables, setTables] = useState<Array<ITable>>([]);
  const form = useForm<ValueType>({
    defaultValues: {
      tableId: undefined,
      type: "Takeaway",
    },
    onSubmit: async ({ value }) => {
      const promise = order
        ? OrdersApi.updateOrder(order.id, value as Partial<IOrder>)
        : OrdersApi.createOrder(value as Partial<IOrder>);
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

  useEffect(() => {
    TablesApi.all().then((res) => {
      setTables(res);
    });
    if (order) {
      form.setFieldValue("tableId", order.tableId);
      form.setFieldValue("type", order.type);
    } else {
      form.reset();
    }
  }, [order, open]);

  return (
    <Dialog open={open} onClose={onReset}>
      <form
        className="p-6 flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <h3 className="text-xl">{order ? "Update" : "Create"} Order</h3>
        <fieldset className="flex flex-col gap-4">
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
                  {order ? "Update" : "Create"}
                </Button>
              </div>
            )}
          />
        </fieldset>
      </form>
    </Dialog>
  );
}
