import Dialog from "@app/components/baseui/Dialog";
import Button from "@app/components/baseui/Button";
import Input from "@app/components/baseui/Input";
import CategoriesApi from "@app/services/categories";
import { ICategory } from "@app/types/product";
import { useForm } from "@tanstack/react-form";
import { AxiosError } from "axios";
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
  const form = useForm<ValueType>({
    defaultValues: {
      name: "",
    },
    onSubmit: async function handleOnSubmit({ value, formApi }) {
      const promise = category
        ? CategoriesApi.update(category.id, value)
        : CategoriesApi.create(value);
      toast.promise(promise, {
        success: "Successfully saved",
        loading: "please wait...",
        error: "Error while saving category.",
      });
      return promise
        .then(() => {
          formApi.reset();
          onSave(value);
        })
        .catch((err: AxiosError<{ message: string }>) => {
          if (err.response?.data) {
            alert(err.response?.data.message);
          } else {
            alert(err.message);
          }
        });
    },
  });

  useEffect(() => {
    if (category) {
      form.setFieldValue("name", category.name);
    } else {
      form.reset();
    }
  }, [category, open]);
  return (
    <Dialog open={open} onClose={onReset}>
      <form
        className="p-6"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <h3 className="text-xl">{category ? "Update" : "Create"} Category</h3>
        <div className="flex flex-col gap-4 py-4">
          <form.Field
            name="name"
            children={({ state, handleBlur, handleChange, name }) => (
              <Input
                type="text"
                label="Name"
                required
                value={state.value}
                onChange={(e) => handleChange(e.target.value)}
                onBlur={handleBlur}
                name={name}
                error={state.meta.errors.join(" ")}
                touched={state.meta.isTouched}
              />
            )}
          />
        </div>

        <form.Subscribe
          children={({ isSubmitting, canSubmit }) => (
            <div className="flex gap-2 justify-end">
              <Button className=" bg-gray-300" onClick={onReset} type="button">
                Cancel
              </Button>
              <Button
                className=" bg-lime-600 text-white"
                type="submit"
                disabled={!canSubmit}
                loading={isSubmitting}
              >
                {category ? "Update" : "Create"}
              </Button>
            </div>
          )}
        />
      </form>
    </Dialog>
  );
}
