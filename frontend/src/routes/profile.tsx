import Button from "@app/components/baseui/Button";
import Input from "@app/components/baseui/Input";
import AccountApi from "@app/services/account";
import { AuthStateLoggedIn, useAuthStore } from "@app/store/auth";
import { useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import toast from "react-hot-toast";

export const Route = createFileRoute("/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  const [auth] = useAuthStore<AuthStateLoggedIn>();
  const profileForm = useForm({
    defaultValues: {
      name: auth.user.name,
      phone: auth.user.phone,
      email: auth.user.email,
    },
    onSubmit: ({ value }) =>
      AccountApi.updateProfile(value)
        .then(() => toast.success("Profile updated."))
        .catch((e) => toast.error(e.message)),
  });

  const passwordForm = useForm({
    defaultValues: {
      password: "",
      newPassword: "",
      confirmPassword: "",
    },
    onSubmit: ({ value }) =>
      AccountApi.updatePassword(value)
        .then(() => toast.success("Password updated."))
        .catch((e) => toast.error(e.message)),
  });
  return (
    <div className="p-5 max-w-[1000px] m-auto flex flex-col gap-8 py-10">
      <div className="md:p-8 p-6 bg-white border rounded-lg">
        <h3 className="text-xl">Profile Information</h3>
        <p className="mt-2 text-gray-500 text-sm">
          Update your account's profile information and email address.{" "}
        </p>

        <form
          className="flex flex-col gap-7 max-w-lg pt-6"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            profileForm.handleSubmit();
          }}
        >
          <profileForm.Field
            name="name"
            children={({ state, handleBlur, handleChange, name }) => (
              <Input
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

          <profileForm.Field
            name="email"
            children={({ state, handleBlur, handleChange, name }) => (
              <Input
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

          <profileForm.Field
            name="phone"
            children={({ state, handleBlur, handleChange, name }) => (
              <Input
                label="Phone"
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

          <profileForm.Subscribe
            children={({ isSubmitting, canSubmit }) => (
              <div>
                <Button
                  className="bg-indigo-600 text-white"
                  type="submit"
                  disabled={!canSubmit}
                  loading={isSubmitting}
                >
                  Update Profile
                </Button>
              </div>
            )}
          />
        </form>
      </div>

      <div className="md:p-8 p-6 bg-white border rounded-lg">
        <h3 className="text-xl">Update Password</h3>
        <p className="mt-2 text-gray-500 text-sm">
          Ensure your account is using a long, random password to stay secure.
        </p>

        <form
          className="flex flex-col gap-7 max-w-lg pt-6"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            passwordForm.handleSubmit();
          }}
        >
          <passwordForm.Field
            name="password"
            children={({ state, handleBlur, handleChange, name }) => (
              <Input
                label="Current Password"
                required
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

          <passwordForm.Field
            name="newPassword"
            children={({ state, handleBlur, handleChange, name }) => (
              <Input
                label="New Password"
                required
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

          <passwordForm.Field
            name="confirmPassword"
            children={({ state, handleBlur, handleChange, name }) => (
              <Input
                label="Confirm Password"
                required
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

          <passwordForm.Subscribe
            children={({ isSubmitting, canSubmit }) => (
              <div>
                <Button
                  className="bg-indigo-600 text-white"
                  type="submit"
                  disabled={!canSubmit}
                  loading={isSubmitting}
                >
                  Update password
                </Button>
              </div>
            )}
          />
        </form>
      </div>
    </div>
  );
}
