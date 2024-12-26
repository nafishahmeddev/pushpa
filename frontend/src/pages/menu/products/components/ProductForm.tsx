import CategoriesApi from "@app/services/categories";
import ProductsApi from "@app/services/products";
import { ICategory, IProduct } from "@app/types/product";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import { useEffect, useState } from "react";

type ProductFormProps = {
  product: IProduct | undefined;
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
    <form className="w-[330px] p-4 h-full" onSubmit={formik.handleSubmit}>
      <fieldset disabled={formik.isSubmitting}>
        <div className="flex flex-col gap-4">
          <div className="input flex flex-col gap-2">
            <label className=" ">Name</label>
            <input
              required
              type="text"
              className="bg-white py-2 px-2"
              {...formik.getFieldProps("name")}
            />
          </div>

          <div className="input flex flex-col gap-2">
            <label className=" ">Category</label>
            <select
              className="bg-white py-2 px-2"
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
              <label className=" ">SGST</label>
              <input
                type="number"
                required
                className="bg-white py-2 px-2 min-w-0 w-full"
                {...formik.getFieldProps("sgst")}
              />
            </div>

            <div className="input flex flex-col gap-2 flex-1">
              <label className=" ">CGST</label>
              <input
                type="number"
                required
                className="bg-white py-2 px-2 min-w-0 w-full"
                {...formik.getFieldProps("cgst")}
              />
            </div>
          </div>

          <div className="input flex flex-col gap-2">
            <label className=" ">Price</label>
            <input
              type="number"
              required
              className="bg-white py-2 px-2"
              {...formik.getFieldProps("price")}
            />
          </div>

          <div className="flex gap-2">
            <button
              className="px-2 py-2 bg-emerald-800 text-white flex-1"
              type="submit"
            >
              {product ? "Update" : "Create"}
            </button>
            <button
              className="px-2 py-2 bg-rose-800 text-white flex-1"
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
