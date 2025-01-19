import Button from "@app/components/baseui/Button";
import Input from "@app/components/baseui/Input";
import Select from "@app/components/baseui/Select";
import Textarea from "@app/components/baseui/Textarea";
import AccountApi from "@app/services/account";
import { AuthStateLoggedIn, useAuthStore } from "@app/store/auth";
import { IRestaurant } from "@app/types/restaurant";
import { useForm } from "@tanstack/react-form";
import { createLazyFileRoute } from "@tanstack/react-router";
import toast from "react-hot-toast";

export const Route = createLazyFileRoute("/settings/details/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [auth] = useAuthStore<AuthStateLoggedIn>();
  const form = useForm({
    defaultValues: auth.user.restaurant as IRestaurant,
    onSubmit: async ({ value }) =>
      AccountApi.updateRestaurant(value)
        .then(() => {
          toast.success("Restaurant details has been updated..");
        })
        .catch((err) => toast.error(err.message)),
  });
  return (
    <form
      className="h-full grid md:grid-cols-[400px_1fr] gap-6 overflow-auto"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div className="flex flex-col gap-5 bg-white overflow-auto">
        <div className="flex gap-3 items-center px-6 pt-6">
          <h2 className="text-2xl">Store details</h2>
        </div>

        <div className="">
          <div className="flex flex-col gap-5 px-6 pb-6">
            <form.Field
              name="name"
              children={({ state, handleBlur, handleChange, name }) => (
                <Input
                  label="Store name"
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
              name="address"
              children={({ state, handleBlur, handleChange, name }) => (
                <Textarea
                  label="Store Address"
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
              name="phone"
              children={({ state, handleBlur, handleChange, name }) => (
                <Input
                  label="Phone"
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
              name="email"
              children={({ state, handleBlur, handleChange, name }) => (
                <Input
                  label="Email"
                  type="email"
                  value={state.value}
                  onChange={(e) => handleChange(e.target.value)}
                  onBlur={handleBlur}
                  name={name}
                  error={state.meta.errors.join(" ")}
                  touched={state.meta.isTouched}
                />
              )}
            />

            <div className=" gap-6 grid grid-cols-2">
              <form.Field
                name="country"
                children={({ state, handleBlur, handleChange, name }) => (
                  <Select
                    label="Country"
                    value={state.value}
                    onChange={(e) => handleChange(e.target.value)}
                    onBlur={handleBlur}
                    name={name}
                    error={state.meta.errors.join(" ")}
                    touched={state.meta.isTouched}
                  >
                    <option value="IN">India</option>
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                  </Select>
                )}
              />

              <form.Field
                name="currency"
                children={({ state, handleBlur, handleChange, name }) => (
                  <Select
                    label="Currency"
                    value={state.value}
                    onChange={(e) => handleChange(e.target.value)}
                    onBlur={handleBlur}
                    name={name}
                    error={state.meta.errors.join(" ")}
                    touched={state.meta.isTouched}
                  >
                    <option value="INR">Indian Rupee</option>
                    <option value="USD">US Dollar</option>
                    <option value="GBP">Pound</option>
                  </Select>
                )}
              />
            </div>
            <form.Subscribe
              children={({ isSubmitting, canSubmit }) => (
                <div className="flex justify-end mt-3">
                  <Button
                    className="bg-indigo-600 text-white"
                    disabled={!canSubmit}
                    loading={isSubmitting}
                  >
                    Save Details
                  </Button>
                </div>
              )}
            />
          </div>
        </div>
      </div>

      <div className="items-center justify-center p-10 md:flex hidden h-full">
        <img
          src="/scene.webp"
          className="max-w-full max-h-[600px] object-contain"
        />
      </div>
    </form>
  );
}
