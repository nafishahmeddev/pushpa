import Dialog from "@app/components/ui/Dialog";
import Button from "@app/components/ui/form/button";
import Input from "@app/components/ui/form/input";
import LocationsApi from "@app/services/locations";
import { ILocation } from "@app/types/location";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import { useEffect } from "react";
import toast from "react-hot-toast";

type TableFormProps = {
  open: boolean;
  location?: ILocation;
  onReset: () => void;
  onSave: (values: { name: string }) => Promise<void>;
};
type ValueType = {
  name: string;
};
export default function LocationForm({
  open = false,
  location,
  onReset,
  onSave,
}: TableFormProps) {
  const formik = useFormik<ValueType>({
    initialValues: {
      name: "",
    },
    onSubmit: handleOnSubmit,
  });

  async function handleOnSubmit(values: ValueType) {
    const promise = location
      ? LocationsApi.update(location.id, values)
      : LocationsApi.create(values);

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
    if (location) {
      formik.setValues({
        ...location,
      });
    } else {
      formik.resetForm();
    }
  }, [location]);

  return (
    <Dialog open={open} onClose={() => onReset()}>
      <form className="p-6" onSubmit={formik.handleSubmit}>
        <h3 className="text-xl">{location ? "Update" : "Create"} Location</h3>
        <fieldset disabled={formik.isSubmitting} className="block w-full">
          <div className="flex flex-col gap-2 w-full py-4">
            <Input
              label="Name"
              required
              type="text"
              {...formik.getFieldProps("name")}
              meta={formik.getFieldMeta("name")}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button className="bg-gray-300" onClick={onReset} type="button">
              Cancel
            </Button>
            <Button className="bg-blue-600 text-white" type="submit">
              {location ? "Update" : "Create"}
            </Button>
          </div>
        </fieldset>
      </form>
    </Dialog>
  );
}
