import Dialog from "@app/components/ui/Dialog";
import Button from "@app/components/ui/form/button";
import Input from "@app/components/ui/form/input";
import Select from "@app/components/ui/form/select";
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
      cgst: NaN,
      sgst: NaN,
      price: NaN,
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
    <Dialog open={open} onClose={() => onReset()}>
      <form className="p-6" onSubmit={formik.handleSubmit}>
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
              label="Category"
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
            <Button className=" bg-gray-300  " onClick={onReset} type="button">
              Cancel
            </Button>
            <Button className="bg-purple-600 text-white " type="submit">
              {product ? "Update" : "Create"}
            </Button>
          </div>
        </fieldset>
      </form>
    </Dialog>
  );
}
