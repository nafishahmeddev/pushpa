import Button from "@app/components/ui/form/button";
import Input from "@app/components/ui/form/input";
import AuthApi from "@app/services/auth";
import { AuthState, useAuthStore } from "@app/store/auth";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { useEffect } from "react";
import toast from "react-hot-toast";
export const Route = createLazyFileRoute("/auth/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const [auth] = useAuthStore<AuthState>();
  const form = useForm({
    defaultValues: {
      email: "",
      pass: "",
    },
    onSubmit: ({ value }) => {
      const promise = AuthApi.login(value);
      return promise.catch((err) => toast.error(err.message));
    },
  });

  useEffect(() => {
    if (!auth.loading && auth.loggedIn) {
      navigate({ to: "/" });
    }
  }, [auth]);
  return (
    <div className="flex bg-gray-50 h-dvh w-dvw">
      <div className="flex-1 hidden lg:flex items-center justify-center p-9 h-full">
        <img src="/login-scene.webp" className="max-w-full" />
      </div>
      <div className="flex-1 bg-white p-6 lg:max-w-[500px] flex items-center justify-center h-full">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="flex flex-col flex-1 max-w-[350px]"
        >
          <h3 className="text-xl">Login</h3>
          <div className="flex flex-col gap-5 py-4">
            <form.Field
              name="email"
              children={({ state, handleBlur, handleChange, name }) => (
                <Input
                  type="email"
                  placeholder="Please enter your email"
                  label="Email"
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

            <form.Field
              name="pass"
              children={({ state, handleBlur, handleChange, name }) => (
                <Input
                  type="password"
                  placeholder="Please enter your password"
                  label="Password"
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
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  className="bg-lime-600 text-white mt-4"
                  disabled={!canSubmit || isSubmitting}
                  loading={isSubmitting}
                >
                  Sign In
                </Button>
              )}
            />

            <div className="text-center text-gray-400">
              <small>© 2025 RestPal. All rights reserved.</small>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
