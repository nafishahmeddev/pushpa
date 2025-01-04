import Dialog from "@app/components/ui/Dialog";
import Button from "@app/components/ui/form/button";
import Input from "@app/components/ui/form/input";
import CategoriesApi from "@app/services/categories";
import { ICategory } from "@app/types/product";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import { useEffect } from "react";
import toast from "react-hot-toast";

type CategoryFormProps = {
  open: boolean;
  category: ICategory | undefined;
  onReset: () => void;
  onSave: (values: { name: string }) => Promise<void>;
};
type ValueType = {
  name: string;
};
export default function CategoryFormDialog({
  open = false,
  category,
  onReset,
  onSave,
}: CategoryFormProps) {
  const formik = useFormik<ValueType>({
    initialValues: {
      name: "",
    },
    onSubmit: handleOnSubmit,
  });

  async function handleOnSubmit(values: ValueType) {
    const promise = category
      ? CategoriesApi.update(category.id, values)
      : CategoriesApi.create(values);
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
    if (category) {
      formik.setValues({
        name: category.name,
      });
    } else {
      formik.resetForm();
    }
  }, [category]);
  return (
    <Dialog open={open} onClose={onReset}>
      <form className="p-6" onSubmit={formik.handleSubmit}>
        <h3 className="text-xl">{category ? "Update" : "Create"} Category</h3>
        <fieldset disabled={formik.isSubmitting}>
          <div className="flex flex-col gap-4 py-4">
            <Input
              type="text"
              required
              label="Name"
              {...formik.getFieldProps("name")}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button className=" bg-gray-300" onClick={onReset} type="button">
              Cancel
            </Button>
            <Button className=" bg-lime-600 text-white" type="submit">
              {category ? "Update" : "Create"}
            </Button>
          </div>
        </fieldset>
      </form>
    </Dialog>
  );
}
