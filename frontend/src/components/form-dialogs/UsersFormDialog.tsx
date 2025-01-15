import Dialog from "@app/components/baseui/Dialog";
import Button from "@app/components/baseui/Button";
import Input from "@app/components/baseui/Input";
import Select from "@app/components/baseui/Select";
import UsersApi from "@app/services/users";
import { IUser, UserDesignation } from "@app/types/user";
import { useForm } from "@tanstack/react-form";
import { useEffect } from "react";
import toast from "react-hot-toast";

type UserFormProps = {
  open: boolean;
  user?: IUser;
  onReset: () => void;
  onSave: (values: { name: string }) => Promise<void>;
};
type ValueType = {
  name: string;
  email: string;
  phone: string;
  designation: string;
  password: string;
};
export default function UserForm({
  open = false,
  user,
  onReset,
  onSave,
}: UserFormProps) {
  const form = useForm<ValueType>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      designation: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      const promise = user
        ? UsersApi.update(user.id, value)
        : UsersApi.create(value);
      return promise
        .then(() => {
          onSave(value);
        })
        .catch((err) => {
          toast.error(err.message);
        });
    },
  });

  useEffect(() => {
    if (user) {
      form.setFieldValue("name", user.name);
      form.setFieldValue("email", user.email);
      form.setFieldValue("phone", user.phone);
      form.setFieldValue("designation", user.designation);
      form.setFieldValue("password", "");
    } else {
      form.reset();
    }
  }, [user, open]);

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
        <h3 className="text-xl">{user ? "Update" : "Create"} User</h3>
        <fieldset className="block w-full">
          <div className="flex flex-col gap-4 w-full py-4">
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
              name="email"
              children={({ state, handleBlur, handleChange, name }) => (
                <Input
                  label="Email"
                  required
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

            <form.Field
              name="phone"
              children={({ state, handleBlur, handleChange, name }) => (
                <Input
                  label="Phone"
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
              name="designation"
              children={({ state, handleBlur, handleChange, name }) => (
                <Select
                  label="Designation"
                  required
                  value={state.value}
                  onChange={(e) => handleChange(e.target.value)}
                  onBlur={handleBlur}
                  name={name}
                  error={state.meta.errors.join(" ")}
                  touched={state.meta.isTouched}
                  disabled={state.value == UserDesignation.Owner}
                >
                  <option value=""></option>
                  {Object.values(UserDesignation).map((designation) => (
                    <option
                      key={designation}
                      disabled={designation == UserDesignation.Owner}
                    >
                      {designation}
                    </option>
                  ))}
                </Select>
              )}
            />

            <form.Field
              name="password"
              children={({ state, handleBlur, handleChange, name }) => (
                <Input
                  label="Password"
                  type="password"
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
                  {user ? "Update" : "Create"}
                </Button>
              </div>
            )}
          />
        </fieldset>
      </form>
    </Dialog>
  );
}
