import Button from "@app/components/ui/form/button";
import Input from "@app/components/ui/form/input";
import Select from "@app/components/ui/form/select";
import Textarea from "@app/components/ui/form/textarea";
import ScrollView from "@app/components/ui/ScrollView";
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
      AccountApi.updateRestaurant(value).catch((err) =>
        toast.error(err.message),
      ),
  });
  return (
    <form
      className="h-full grid grid-cols-[400px_1fr] gap-6 overflow-auto"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div className="grid grid-rows-[auto_1fr] gap-5 h-full bg-white overflow-auto">
        <div className="flex gap-3 items-center px-6 pt-6">
          <h2 className="text-2xl">Store details</h2>
        </div>

        <div className="h-full overflow-auto">
          <ScrollView>
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
                      className="bg-lime-600 text-white"
                      disabled={!canSubmit}
                      loading={isSubmitting}
                    >
                      Save Details
                    </Button>
                  </div>
                )}
              />
            </div>
          </ScrollView>
        </div>
      </div>

      <div className="flex items-center justify-center p-10">
        <img src="/scene.png" className="w-full"/>
      </div>
    </form>
  );
}
