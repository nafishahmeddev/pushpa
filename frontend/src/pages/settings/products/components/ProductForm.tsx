import CategoriesApi from "@app/services/categories";
import ProductsApi from "@app/services/products";
import { ICategory, IProduct } from "@app/types/product";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type ProductFormProps = {
  open: boolean;
  product?: IProduct;
  onReset: () => void;
  onSave: (values: { name: string }) => Promise<void>;
};
type ValueType = {
  name: string;
  categoryId: string;
  cgst: number;
  sgst: number;
  price: number;
};
export default function ProductForm({
  open = false,
  product,
  onReset,
  onSave,
}: ProductFormProps) {
  const [categories, setCategories] = useState<Array<ICategory>>([]);
  const formik = useFormik<ValueType>({
    initialValues: {
      name: "",
      categoryId: "",
      cgst: 0,
      sgst: 0,
      price: 0,
    },
    onSubmit: handleOnSubmit,
  });

  async function handleOnSubmit(values: ValueType) {
    const promise = product
      ? ProductsApi.update(product.id, values)
      : ProductsApi.create(values);

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
    if (product) {
      formik.setValues({
        ...product,
      });
    } else {
      formik.resetForm();
    }
  }, [product]);

  useEffect(() => {
    CategoriesApi.all().then(setCategories);
  }, []);
  return (
    <dialog
      open={open}
      className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black/25  z-20 open:visible collapse group transition-all"
    >
      <form
        className="p-6 bg-white rounded-2xl group-open:scale-100 group-open:opacity-100 scale-50 opacity-0 transition-all flex-1 max-w-[450px]"
        onSubmit={formik.handleSubmit}
      >
        <h3 className="text-xl">{product ? "Update" : "Create"} Category</h3>
        <fieldset disabled={formik.isSubmitting} className="block w-full">
          <div className="flex flex-col gap-4 w-full py-4">
            <div className="input flex flex-col gap-2">
              <label className="text-sm text-gray-700">Name</label>
              <input
                required
                type="text"
                className="bg-gray-100 rounded-2xl py-3 px-4 focus:outline-2 min-w-0 w-full"
                {...formik.getFieldProps("name")}
              />
            </div>

            <div className="input flex flex-col gap-2">
              <label className="text-sm text-gray-700">Category</label>
              <select
                className="bg-gray-100 rounded-2xl py-3 px-4 focus:outline-2 min-w-0 w-full"
                required
                {...formik.getFieldProps("categoryId")}
              >
                <option value="" />
                {categories.map((category) => (
                  <option value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <div className="input flex flex-col gap-2 flex-1">
                <label className="text-sm text-gray-700">SGST</label>
                <input
                  type="number"
                  required
                  className="bg-gray-100 rounded-2xl py-3 px-4 focus:outline-2 min-w-0 w-full"
                  {...formik.getFieldProps("sgst")}
                />
              </div>

              <div className="input flex flex-col gap-2 flex-1">
                <label className="text-sm text-gray-700">CGST</label>
                <input
                  type="number"
                  required
                  className="bg-gray-100 rounded-2xl py-3 px-4 focus:outline-2 min-w-0 w-full"
                  {...formik.getFieldProps("cgst")}
                />
              </div>
            </div>

            <div className="input flex flex-col gap-2">
              <label className="text-sm text-gray-700">Price</label>
              <input
                type="number"
                required
                className="bg-gray-100 rounded-2xl py-3 px-4 focus:outline-2"
                {...formik.getFieldProps("price")}
              />
            </div>
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
              {product ? "Update" : "Create"}
            </button>
          </div>
        </fieldset>
      </form>
    </dialog>
  );
}
