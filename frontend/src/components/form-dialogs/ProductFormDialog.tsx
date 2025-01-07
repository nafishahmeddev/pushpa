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
import { Icon } from "@iconify/react";
import { uploadUrl } from "@app/lib/upload";
import Image from "rc-image";
import imageCompression from "browser-image-compression";

type ProductFormProps = {
  open: boolean;
  product?: IProduct;
  onReset: () => void;
  onSave: (values: { name: string }) => Promise<void>;
};
type ValueType = {
  name: string;
  image: string;
  categoryId: string;
  description: string;
  tax: number;
  price: number;
};
export default function ProductFormDialog({
  open = false,
  product,
  onReset,
  onSave,
}: ProductFormProps) {
  const [categories, setCategories] = useState<Array<ICategory>>([]);
  const [selectedImage, setSelectedImage] = useState<File>();
  const form = useForm<ValueType>({
    defaultValues: product ?? {
      name: "",
      image: "",
      description: "",
      categoryId: "",
      tax: 0,
      price: 0,
    },
    onSubmit: async ({ value, formApi }) => {
      const fd = new FormData();
      fd.append("values", JSON.stringify(value));
      if (selectedImage) {
        fd.append("image", selectedImage);
      }
      const promise = product
        ? ProductsApi.update(product.id, fd)
        : ProductsApi.create(fd);
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

  const handleOnImagePic = async (file: File | undefined) => {
    if (!file) {
      return;
    }
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 300,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(file, options);
      setSelectedImage(compressedFile);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    CategoriesApi.all().then(setCategories);
  }, []);

  useEffect(() => {
    if (selectedImage) {
      setSelectedImage(undefined);
    }
    if (product) {
      form.setFieldValue("name", product.name);
      form.setFieldValue("image", product.image);
      form.setFieldValue("categoryId", product.categoryId);
      form.setFieldValue("description", product.description);
      form.setFieldValue("tax", product.tax);
      form.setFieldValue("price", product.price);
    } else {
      form.reset();
    }
  }, [open, product]);
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
          <div className="flex flex-col gap-4 w-full py-4">
            <form.Subscribe
              selector={({ values }) => values.image}
              children={(image) => (
                <div className="relative w-28 inline-flex">
                  <label
                    htmlFor="image"
                    className="w-full aspect-square object-cover rounded-xl border overflow-hidden cursor-pointer"
                  >
                    <Image
                      src={
                        selectedImage
                          ? URL.createObjectURL(selectedImage)
                          : image
                            ? uploadUrl(image)
                            : undefined
                      }
                      fallback="/placeholder-category.png"
                      className="w-full aspect-square  object-cover bg-gray-100"
                    />
                    <input
                      type="file"
                      className="hidden"
                      id="image"
                      name="image"
                      accept="image/*"
                      onChange={(e) => {
                        handleOnImagePic(e.target.files?.[0]);
                        e.target.type = "text";
                        e.target.type = "file";
                      }}
                    />
                  </label>
                  {selectedImage && (
                    <a
                      className="absolute top-1 right-1 pointer cursor-pointer aspect-square bg-white/20 rounded-full backdrop-blur-sm"
                      onClick={() => setSelectedImage(undefined)}
                    >
                      <Icon icon="material-symbols:close-rounded" />
                    </a>
                  )}
                </div>
              )}
            />

            <form.Field
              name="name"
              children={({ state, handleBlur, handleChange, name }) => (
                <Input
                  label="Name"
                  required
                  type="text"
                  placeholder="Enter product name"
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
                  placeholder="Enter product description"
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
                  value={state.value || ""}
                  onChange={(e) => handleChange(e.target.value)}
                  onBlur={handleBlur}
                  name={name}
                  error={state.meta.errors.join(" ")}
                  touched={state.meta.isTouched}
                >
                  <option value="" >Select Category</option>
                  {categories.map((category) => (
                    <option value={category.id} key={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              )}
            />

            <div className="flex gap-2">
              <form.Field
                name="price"
                children={({ state, handleBlur, handleChange, name }) => (
                  <Input
                    label="Price"
                    required
                    type="number"
                    placeholder="Enter gross price"
                    value={state.value || 0}
                    onChange={(e) => handleChange(Number(e.target.value))}
                    onBlur={handleBlur}
                    name={name}
                    error={state.meta.errors.join(" ")}
                    touched={state.meta.isTouched}
                  />
                )}
              />
              <form.Field
                name="tax"
                children={({ state, handleBlur, handleChange, name }) => (
                  <Input
                    label="Tax(%)"
                    // required
                    type="number"
                    className="flex-1"
                    placeholder="Enter tax percentage"
                    value={state.value || ""}
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
