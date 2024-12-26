import CategoriesApi from "@app/services/categories";
import { ICategory } from "@app/types/product";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import { useEffect } from "react";

type CategoryFormProps = {
  category: ICategory | undefined;
  onReset: () => void;
  onSave: (values: { name: string }) => Promise<void>;
};
type ValueType = {
  name: string;
};
export default function CategoryForm({
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
      formik.setValues({
        name: "",
      });
    }
  }, [category]);
  return (
    <form className="w-[330px] p-4 h-full" onSubmit={formik.handleSubmit}>
      <fieldset disabled={formik.isSubmitting}>
        <div className="flex flex-col gap-4">
          <div className="input flex flex-col gap-2">
            <label className=" ">Name</label>
            <input
              type="text"
              className="bg-white py-2 px-2"
              {...formik.getFieldProps("name")}
            />
          </div>

          <div className="flex gap-2">
            <button
              className="px-2 py-2 bg-emerald-800 text-white flex-1 hover:opacity-60"
              type="submit"
            >
              {category ? "Update" : "Create"}
            </button>
            <button
              className="px-2 py-2 bg-rose-800 text-white flex-1 hover:opacity-60"
              onClick={onReset}
              type="button"
            >
              Cancel
            </button>
          </div>
        </div>
      </fieldset>
    </form>
  );
}
