import Dialog from "@app/components/ui/Dialog";
import Button from "@app/components/ui/form/button";
import Input from "@app/components/ui/form/input";
import Select from "@app/components/ui/form/select";
import LocationsApi from "@app/services/locations";
import TablesApi from "@app/services/tables";
import { ILocation } from "@app/types/location";
import { ITable } from "@app/types/table";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type TableFormProps = {
  open: boolean;
  table?: ITable;
  onReset: () => void;
  onSave: (values: { name: string }) => Promise<void>;
};
type ValueType = {
  name: string;
  capacity: number;
  status: string;
  locationId: string;
};
export default function TableFormDialog({
  open = false,
  table,
  onReset,
  onSave,
}: TableFormProps) {
  const [locations, setLocations] = useState<Array<ILocation>>([]);
  const formik = useFormik<ValueType>({
    initialValues: {
      name: "",
      capacity: NaN,
      status: "Available",
      locationId: "",
    },
    onSubmit: handleOnSubmit,
  });

  async function handleOnSubmit(values: ValueType) {
    const promise = table
      ? TablesApi.update(table.id, values)
      : TablesApi.create(values);

    toast.promise(promise, {
      success: "Successfully saved",
      loading: "please wait...",
      error: "Error while saving category.",
    });
    return promise
      .then(() => {
        formik.resetForm();
        onSave(values);
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
    LocationsApi.all().then(setLocations);
    if (table) {
      formik.setValues({
        ...table,
      });
    } else {
      formik.resetForm();
    }
  }, [table]);

  return (
    <Dialog open={open} onClose={() => onReset()}>
      <form className="p-6" onSubmit={formik.handleSubmit}>
        <h3 className="text-xl">{table ? "Update" : "Create"} Table</h3>
        <fieldset disabled={formik.isSubmitting} className="block w-full">
          <div className="flex flex-col gap-2 w-full py-4">
            <Input
              label="Name"
              required
              type="text"
              {...formik.getFieldProps("name")}
              meta={formik.getFieldMeta("name")}
            />

            <Select
              label="Location"
              required
              {...formik.getFieldProps("locationId")}
              meta={formik.getFieldMeta("locationId")}
            >
              <option></option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </Select>

            <Select
              label="Status"
              required
              {...formik.getFieldProps("status")}
              meta={formik.getFieldMeta("status")}
            >
              <option>Available</option>
              <option>Occupied</option>
              <option>Reserved</option>
              <option>Blocked</option>
            </Select>

            <Input
              label="Capacity"
              required
              type="number"
              {...formik.getFieldProps("capacity")}
              meta={formik.getFieldMeta("capacity")}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button className="bg-gray-300" onClick={onReset} type="button">
              Cancel
            </Button>
            <Button className="bg-lime-600 text-white" type="submit">
              {table ? "Update" : "Create"}
            </Button>
          </div>
        </fieldset>
      </form>
    </Dialog>
  );
}
