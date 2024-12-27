import Input from "@app/components/form/input";
import Select from "@app/components/form/select";
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
        className="p-6 bg-white rounded-2xl group-open:scale-100 group-open:opacity-100 scale-50 opacity-0 transition-all flex-1 max-w-[400px]"
        onSubmit={formik.handleSubmit}
      >
        <h3 className="text-xl">{product ? "Update" : "Create"} Product</h3>
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
              label="Name"
              required
              {...formik.getFieldProps("categoryId")}
              meta={formik.getFieldMeta("categoryId")}
            >
              <option value="" />
              {categories.map((category) => (
                <option value={category.id} key={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>

            <div className="flex gap-2">
              <Input
                label="SGST"
                required
                type="number"
                className="flex-1"
                {...formik.getFieldProps("sgst")}
                meta={formik.getFieldMeta("sgst")}
              />

              <Input
                label="CGST"
                required
                type="number"
                className="flex-1"
                {...formik.getFieldProps("cgst")}
                meta={formik.getFieldMeta("cgst")}
              />
            </div>

            <Input
              label="Price"
              required
              type="number"
              {...formik.getFieldProps("price")}
              meta={formik.getFieldMeta("price")}
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
              {product ? "Update" : "Create"}
            </button>
          </div>
        </fieldset>
      </form>
    </dialog>
  );
}
