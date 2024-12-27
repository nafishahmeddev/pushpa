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
export default function CategoryForm({
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
    <dialog
      open={open}
      className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black/25  z-20 open:visible collapse group transition-all"
    >
      <form
        className="w-[330px] p-6 bg-white rounded-2xl group-open:scale-100 group-open:opacity-100 scale-50 opacity-0 transition-all flex-1 max-w-[400px]"
        onSubmit={formik.handleSubmit}
      >
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
            <button
              className="px-5 py-2 bg-gray-300  hover:opacity-60 rounded-2xl"
              onClick={onReset}
              type="button"
            >
              Cancel
            </button>
            <button
              className="px-5 py-2 bg-emerald-600 text-white  hover:opacity-60 rounded-2xl"
              type="submit"
            >
              {category ? "Update" : "Create"}
            </button>
          </div>
        </fieldset>
      </form>
    </dialog>
  );
}
