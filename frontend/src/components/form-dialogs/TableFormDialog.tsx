import Dialog from "@app/components/ui/Dialog";
import Button from "@app/components/ui/form/button";
import Input from "@app/components/ui/form/input";
import Select from "@app/components/ui/form/select";
import LocationsApi from "@app/services/locations";
import TablesApi from "@app/services/tables";
import { ILocation } from "@app/types/location";
import { ITable } from "@app/types/table";
import { useForm } from "@tanstack/react-form";
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
  const form = useForm<ValueType>({
    defaultValues: {
      name: "",
      capacity: 0,
      status: "Available",
      locationId: "",
    },
    onSubmit: async ({ value, formApi }) => {
      const promise = table
        ? TablesApi.update(table.id, value)
        : TablesApi.create(value);
      return promise
        .then(() => {
          formApi.reset();
          onSave(value);
        })
        .catch((err) => {
          toast.error(err.message);
        });
    },
  });

  useEffect(() => {
    LocationsApi.all().then(setLocations);
    form.reset();
    if (table) {
      form.setFieldValue("name", table.name);
      form.setFieldValue("capacity", table.capacity);
      form.setFieldValue("status", table.status);
      form.setFieldValue("locationId", table.locationId);
    }
  }, [table]);

  return (
    <Dialog open={open} onClose={() => onReset()}>
      <form
        className="p-6"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <h3 className="text-xl">{table ? "Update" : "Create"} Table</h3>
        <fieldset className="block w-full">
          <div className="flex flex-col gap-2 w-full py-4">
            <form.Field
              name="name"
              children={({ state, handleBlur, handleChange, name }) => (
                <Input
                  label="Name"
                  required
                  type="text"
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
              name="locationId"
              children={({ state, handleBlur, handleChange, name }) => (
                <Select
                  label="Location"
                  required
                  value={state.value}
                  onChange={(e) => handleChange(e.target.value)}
                  onBlur={handleBlur}
                  name={name}
                  error={state.meta.errors.join(" ")}
                  touched={state.meta.isTouched}
                >
                  <option></option>
                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </Select>
              )}
            />

            <form.Field
              name="status"
              children={({ state, handleBlur, handleChange, name }) => (
                <Select
                  label="Status"
                  required
                  value={state.value}
                  onChange={(e) => handleChange(e.target.value)}
                  onBlur={handleBlur}
                  name={name}
                  error={state.meta.errors.join(" ")}
                  touched={state.meta.isTouched}
                >
                  <option>Available</option>
                  <option>Occupied</option>
                  <option>Reserved</option>
                  <option>Blocked</option>
                </Select>
              )}
            />

            <form.Field
              name="capacity"
              children={({ state, handleBlur, handleChange, name }) => (
                <Input
                  label="Capacity"
                  required
                  type="number"
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
                  {table ? "Update" : "Create"}
                </Button>
              </div>
            )}
          />
        </fieldset>
      </form>
    </Dialog>
  );
}
