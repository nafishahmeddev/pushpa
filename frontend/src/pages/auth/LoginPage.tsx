import AuthApi from "@app/services/auth";
import { useFormik } from "formik";

export default function LoginPage() {
  const formik = useFormik({
    initialValues: {
      email: "",
      pass: "",
    },
    onSubmit: AuthApi.login,
  });
  return (
    <div className="flex items-center justify-center p-4 bg-gray-200 h-screen">
      <form
        onSubmit={formik.handleSubmit}
        className="flex-1 bg-white p-6 max-w-[400px] flex flex-col rounded-xl"
      >
        <h3 className="text-xl">Login</h3>
        <div className="flex flex-col gap-4 py-4">
          <div className="input flex flex-col gap-2">
            <label className="text-sm text-gray-700">Name</label>
            <input
              {...formik.getFieldProps("email")}
              type="email"
              placeholder="email"
              required
              className="bg-gray-100 rounded-2xl py-3 px-4 focus:outline-2"
            />
          </div>

          <div className="input flex flex-col gap-2">
            <label className="text-sm text-gray-700">Name</label>
            <input
              {...formik.getFieldProps("pass")}
              type="password"
              required
              placeholder="Password"
              className="bg-gray-100 rounded-2xl py-3 px-4 focus:outline-2"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2 bg-emerald-600 text-white  hover:opacity-60 rounded-2xl"
          >
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
}
