import Dialog from "@app/components/ui/Dialog";
import Button from "@app/components/ui/form/button";
import Input from "@app/components/ui/form/input";
import UsersApi from "@app/services/users";
import { IUser } from "@app/types/user";
import { AxiosError } from "axios";
import { useFormik } from "formik";
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
  const formik = useFormik<ValueType>({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      designation: "",
      password: "",
    },
    onSubmit: handleOnSubmit,
  });

  async function handleOnSubmit(values: ValueType) {
    const promise = user
      ? UsersApi.update(user.id, values)
      : UsersApi.create(values);

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
    if (user) {
      formik.setValues({
        ...user,
      });
    } else {
      formik.resetForm();
    }
  }, [user]);

  return (
    <Dialog open={open} onClose={onReset}>
      <form className="p-6" onSubmit={formik.handleSubmit}>
        <h3 className="text-xl">{user ? "Update" : "Create"} User</h3>
        <fieldset disabled={formik.isSubmitting} className="block w-full">
          <div className="flex flex-col gap-2 w-full py-4">
            <Input
              label="Name"
              required
              type="text"
              {...formik.getFieldProps("name")}
              meta={formik.getFieldMeta("name")}
            />

            <Input
              label="Email"
              required
              type="email"
              {...formik.getFieldProps("email")}
              meta={formik.getFieldMeta("email")}
            />

            <Input
              label="Phone"
              required
              type="text"
              {...formik.getFieldProps("phone")}
              meta={formik.getFieldMeta("phone")}
            />

            <Input
              label="Designation"
              required
              type="text"
              {...formik.getFieldProps("designation")}
              meta={formik.getFieldMeta("designation")}
            />

            <Input
              label="Password"
              type="password"
              {...formik.getFieldProps("password")}
              meta={formik.getFieldMeta("password")}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              className="bg-gray-300"
              onClick={onReset}
              type="button"
            >
              Cancel
            </Button>
            <Button
              className="bg-lime-600 text-white"
              type="submit"
            >
              {user ? "Update" : "Create"}
            </Button>
          </div>
        </fieldset>
      </form>
    </Dialog>
  );
}
