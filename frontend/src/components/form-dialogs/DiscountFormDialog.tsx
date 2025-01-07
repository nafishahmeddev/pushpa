import Dialog from "@app/components/ui/Dialog";
import Button from "@app/components/ui/form/button";
import Input from "@app/components/ui/form/input";
import OrdersApi from "@app/services/orders";
import { IOrder } from "@app/types/orders";
import { useForm } from "@tanstack/react-form";
import { AxiosError } from "axios";
import { useEffect } from "react";
import toast from "react-hot-toast";




type DiscountFormProps = {
  open: boolean;
  order?: IOrder;
  onReset: () => void;
  onSave: (values: Partial<IOrder>) => Promise<void> | void;
};

type ValueType = {
  discount: number;
};
export default function DiscountFormDialog({
  open = false,
  order,
  onReset,
  onSave,
}: DiscountFormProps) {
  const form = useForm<ValueType>({
    defaultValues: {
      discount: 0,
    },
    onSubmit: async function handleOnSubmit({ value, formApi }) {
      const promise = OrdersApi.updateOrder(order?.id as string, value)

      toast.promise(promise, {
        success: "Successfully saved",
        loading: "please wait...",
        error: "Error while saving order.",
      });
      return promise
        .then(() => {
          formApi.reset();
          onSave(value);
        })
        .catch((err: AxiosError<{ message: string }>) => {
          if (err.response?.data) {
            alert(err.response?.data.message);
          } else {
            alert(err.message);
          }
        });
    },
  });

  useEffect(() => {
    if (order) {
      form.setFieldValue("discount", order.discount);
    } else {
      form.reset();
    }
  }, [order, open]);
  return (
    <Dialog open={open} onClose={onReset}>
      <form
        className="p-6"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <h3 className="text-xl">Discount</h3>
        <div className="flex flex-col gap-4 py-4">
          <form.Field
            name="discount"
            children={({ state, handleBlur, handleChange, name }) => (
              <Input
                type="number"
                label="Discount Amount"
                required
                value={state.value}
                onChange={(e) => handleChange(Number(e.target.value))}
                onBlur={handleBlur}
                name={name}
                error={state.meta.errors.join(" ")}
                touched={state.meta.isTouched}
              />
            )}
          />
        </div>

        <form.Subscribe
          children={({ isSubmitting, canSubmit }) => (
            <div className="flex gap-2 justify-end">
              <Button className=" bg-gray-300" onClick={onReset} type="button">
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
      </form>
    </Dialog>
  );
}
