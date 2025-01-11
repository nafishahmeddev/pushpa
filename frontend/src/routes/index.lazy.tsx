import AdminDashboard from "@app/components/dashboard/AdminDashboard";
import BillerDashboard from "@app/components/dashboard/BillerDashboard";
import { useDatePicker } from "@app/hooks/datepicker";
import { AuthStateLoggedIn, useAuthStore } from "@app/store/auth";
import { UserDesignation } from "@app/types/user";
import { createLazyFileRoute } from "@tanstack/react-router";
export const Route = createLazyFileRoute("/")({ component: RouteComponent });

function RouteComponent() {
  const [auth] = useAuthStore<AuthStateLoggedIn>();
  const { DatePicker } = useDatePicker();

  return (
    <>
      <DatePicker />
    </>
  );
  const getComponent = () => {
    switch (auth.user.designation) {
      case UserDesignation.Owner:
        return AdminDashboard;
      case UserDesignation.Admin:
        return AdminDashboard;
      case UserDesignation.Biller:
        return BillerDashboard;
      default:
        return () => (
          <div className=" p-4 ">
            Hello! {auth.user.name} how are you today?
          </div>
        );
    }
  };
  const Component = getComponent();
  return <Component />;
}
