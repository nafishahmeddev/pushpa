import Dialog from "@app/components/ui/Dialog";
import Button from "@app/components/ui/form/button";
import Input from "@app/components/ui/form/input";
import LocationsApi from "@app/services/locations";
import { ILocation } from "@app/types/location";
import { useForm } from "@tanstack/react-form";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { z } from "zod";

type TableFormProps = {
  open: boolean;
  location?: ILocation;
  onReset: () => void;
  onSave: (values: { name: string }) => Promise<void>;
};
type ValueType = {
  name: string;
};
export default function LocationFormDialog({
  open = false,
  location,
  onReset,
  onSave,
}: TableFormProps) {
  const form = useForm<ValueType>({
    defaultValues: {
      name: "",
    },
    validators: {
      onChange: z.object({
        name: z.string().min(1, "Name is required"),
      }) as never,
    },
    onSubmit: async function ({ value }) {
      const promise = location
        ? LocationsApi.update(location.id, value)
        : LocationsApi.create(value);

      return promise
        .then(() => {
          form.reset();
          onSave(value);
        })
        .catch((err) => {
          toast(err.message);
        });
    },
  });

  useEffect(() => {
    form.reset();
    if (location) {
      form.setFieldValue("name", location.name);
    }
  }, [location]);

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
        <h3 className="text-xl">{location ? "Update" : "Create"} Location</h3>
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
        </div>
        <form.Subscribe
          children={({ isSubmitting, canSubmit }) => (
            <div className="flex gap-2 justify-end">
              <Button className="bg-gray-300" onClick={onReset} type="button">
                Cancel
              </Button>
              <Button
                className="bg-lime-600 text-white"
                type="submit"
                disabled={!canSubmit}
                loading={isSubmitting}
              >
                {location ? "Update" : "Create"}
              </Button>
            </div>
          )}
        />
      </form>
    </Dialog>
  );
}
