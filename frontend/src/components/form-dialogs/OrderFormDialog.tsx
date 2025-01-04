import Dialog from "@app/components/ui/Dialog";
import Button from "@app/components/ui/form/button";
import Select from "@app/components/ui/form/select";
import OrdersApi from "@app/services/orders";
import TablesApi from "@app/services/tables";
import { IOrder } from "@app/types/orders";
import { ITable } from "@app/types/table";
import { AxiosError } from "axios";
import { useFormik } from "formik";
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

export default function OrderFormDialog({ open = false, order, onReset, onSave }: NewOrderModalProps) {
  const [tables, setTables] = useState<Array<ITable>>([]);
  const formik = useFormik<ValueType>({
    initialValues: {
      tableId: "",
      type: "Takeaway",
    },
    onSubmit: handleOnSubmit,
  });

  async function handleOnSubmit(values: ValueType) {
    const promise = order ? OrdersApi.updateOrder(order.id, values) : OrdersApi.createOrder(values);
    toast.promise(promise, {
      success: "Successfully saved",
      loading: "please wait...",
      error: (err) => err.message,
    });
    return promise
      .then((res: IOrder) => {
        formik.resetForm();
        onSave(res);
      })
      .catch((err: AxiosError<{ message: string }>) => {
        if (err.response?.data) {
          alert(err.response?.data.message);
        } else {
          alert(err.message);
        }
      });
  }

  useEffect(() => {
    if (formik.values.type == "Takeaway") {
      formik.setFieldValue("tableId", null);
    }
  }, [formik.values]);
  useEffect(() => {
    if (order) {
      formik.setValues({
        ...(order as ValueType),
      });
    } else {
      formik.resetForm();
    }
  }, [order]);

  useEffect(() => {
    TablesApi.all().then((res) => {
      setTables(res);
    });
  }, []);
  return (
    <Dialog open={open} onClose={onReset}>
      <form className="p-6 flex flex-col gap-4" onSubmit={formik.handleSubmit}>
        <h3 className="text-xl">{order ? "Update" : "Create"} Order</h3>
        <fieldset disabled={formik.isSubmitting} className="flex flex-col gap-4">
          <Select required label="Type" {...formik.getFieldProps("type")} meta={formik.getFieldMeta("type")}>
            <option>Takeaway</option>
            <option>Dine-In</option>
          </Select>

          <Select required label="Table" {...formik.getFieldProps("tableId")} meta={formik.getFieldMeta("tableId")} disabled={formik.values.type == "Takeaway"} value={formik.values.tableId || ""}>
            <option></option>
            {tables.map((table) => (
              <option key={table.id} value={table.id}>
                {table.name}
              </option>
            ))}
          </Select>

          <div className="flex gap-2 justify-end">
            <Button className=" bg-gray-300" onClick={onReset} type="button">
              Cancel
            </Button>
            <Button className=" bg-lime-600 text-white" type="submit">
              {order ? "Update" : "Create"}
            </Button>
          </div>
        </fieldset>
      </form>
    </Dialog>
  );
}
