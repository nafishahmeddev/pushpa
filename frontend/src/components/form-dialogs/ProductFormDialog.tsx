import Dialog from "@app/components/ui/Dialog";
import Button from "@app/components/ui/form/button";
import Input from "@app/components/ui/form/input";
import Select from "@app/components/ui/form/select";
import Textarea from "@app/components/ui/form/textarea";
import CategoriesApi from "@app/services/categories";
import ProductsApi from "@app/services/products";
import { ICategory, IProduct } from "@app/types/product";
import { useForm } from "@tanstack/react-form";
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
  description: string;
  tax: number;
  netPrice: number;
  price: number;
};
export default function ProductFormDialog({
  open = false,
  product,
  onReset,
  onSave,
}: ProductFormProps) {
  const [categories, setCategories] = useState<Array<ICategory>>([]);
  const form = useForm<ValueType>({
    defaultValues: {
      name: "",
      description: "",
      categoryId: "",
      tax: NaN,
      netPrice: NaN,
      price: NaN,
    },
    onSubmit: async ({ value, formApi }) => {
      const promise = product
        ? ProductsApi.update(product.id, value)
        : ProductsApi.create(value);
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
    form.reset();
    if (product) {
      form.reset();
      form.setFieldValue("name", product.name);
      form.setFieldValue("categoryId", product.categoryId);
      form.setFieldValue("description", product.description);
      form.setFieldValue("tax", product.tax);
      form.setFieldValue("netPrice", product.netPrice);
      form.setFieldValue("price", product.price);
    }
  }, [product]);

  useEffect(() => {
    CategoriesApi.all().then(setCategories);
  }, []);
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
        <h3 className="text-xl">{product ? "Update" : "Create"} Product</h3>
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
              name="description"
              children={({ state, handleBlur, handleChange, name }) => (
                <Textarea
                  label="Description"
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
              name="categoryId"
              children={({ state, handleBlur, handleChange, name }) => (
                <Select
                  label="Category"
                  required
                  value={state.value}
                  onChange={(e) => handleChange(e.target.value)}
                  onBlur={handleBlur}
                  name={name}
                  error={state.meta.errors.join(" ")}
                  touched={state.meta.isTouched}
                >
                  <option value="" />
                  {categories.map((category) => (
                    <option value={category.id} key={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              )}
            />
            <form.Field
              name="price"
              children={({ state, handleBlur, handleChange, name }) => (
                <Input
                  label="Price"
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
            <div className="flex gap-2">
              <form.Field
                name="tax"
                children={({ state, handleBlur, handleChange, name }) => (
                  <Input
                    label="Tax"
                    required
                    type="number"
                    className="flex-1"
                    value={state.value}
                    onChange={(e) => handleChange(Number(e.target.value))}
                    onBlur={handleBlur}
                    name={name}
                    error={state.meta.errors.join(" ")}
                    touched={state.meta.isTouched}
                  />
                )}
              />
              <form.Field
                name="netPrice"
                children={({ state, handleBlur, handleChange, name }) => (
                  <Input
                    label="Net Price"
                    required
                    type="number"
                    className="flex-1"
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
                  {product ? "Update" : "Create"}
                </Button>
              </div>
            )}
          />
        </fieldset>
      </form>
    </Dialog>
  );
}
