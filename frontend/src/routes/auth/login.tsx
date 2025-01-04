import Button from "@app/components/ui/form/button";
import Input from "@app/components/ui/form/input";
import AuthApi from "@app/services/auth";
import { AuthState, useAuthStore } from "@app/store/auth";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import { useEffect } from "react";
import toast from "react-hot-toast";

export const Route = createFileRoute("/auth/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const [auth] = useAuthStore<AuthState>();
  const formik = useFormik({
    initialValues: {
      email: "",
      pass: "",
    },
    onSubmit: (values) => {
      const promise = AuthApi.login(values);
      toast.promise(promise, {
        loading: "please wait",
        success: "successful",
        error: (e: AxiosError) => (e.response?.data as { message: string })?.message ?? "something went wrong! ",
      });
      return promise;
    },
  });

  useEffect(() => {
    if (!auth.loading && auth.loggedIn) {
      navigate({ to: "/" });
    }
  }, [auth]);
  return (
    <div className="flex items-center justify-center p-4 bg-gray-200 h-screen">
      <form onSubmit={formik.handleSubmit} className="flex-1 bg-white p-6 max-w-[350px] flex flex-col rounded-xl">
        <h3 className="text-xl">Login</h3>
        <div className="flex flex-col gap-4 py-4">
          <Input {...formik.getFieldProps("email")} type="email" placeholder="Please enter your email" required label="Email" />

          <Input {...formik.getFieldProps("pass")} type="password" required placeholder="Please enter your password" label="Password" />

          <Button type="submit" className="bg-lime-600 text-white">
            Sign In
          </Button>
        </div>
      </form>
    </div>
  );
}
