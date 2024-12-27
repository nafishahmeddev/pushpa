import Input from "@app/components/form/input";
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
    <dialog
      open={open}
      className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black/25  z-20 open:visible collapse group transition-all"
    >
      <form
        className="p-6 bg-white rounded-2xl group-open:scale-100 group-open:opacity-100 scale-50 opacity-0 transition-all flex-1 max-w-[400px]"
        onSubmit={formik.handleSubmit}
      >
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
              type="text"
              {...formik.getFieldProps("password")}
              meta={formik.getFieldMeta("password")}
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
              {user ? "Update" : "Create"}
            </button>
          </div>
        </fieldset>
      </form>
    </dialog>
  );
}
