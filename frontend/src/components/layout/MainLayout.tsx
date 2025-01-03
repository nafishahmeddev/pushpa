import { NavLink, Outlet } from "react-router";

import { AuthStateLoggedIn } from "@app/store/slices/auth";
import { useAppSelector } from "@app/store";

import { MainNav } from "./MainNav";
import AccountButton from "./AccountButton";
import SplashPage from "@app/pages/SplashPage";
import { IUser, UserDesignation } from "@app/types/user";

const getMenu = (user: IUser) => {
  if (user.designation == UserDesignation.Biller) {
    return [
      {
        label: "Dashboard",
        icon: "mage:dashboard-3",
        route: "/",
      },
      {
        label: "POS",
        icon: "ep:postcard",
        route: "/pos",
      },
      {
        label: "Orders",
        icon: "ep:fork-spoon",
        route: "/orders",
      },
      {
        label: "Invoices",
        icon: "basil:invoice-outline",
        route: "/invoices",
      },
    ];
  }

  return [
    {
      label: "Dashboard",
      icon: "mage:dashboard-3",
      route: "/",
    },
    {
      label: "POS",
      icon: "ep:postcard",
      route: "/pos",
    },
    {
      label: "Orders",
      icon: "ep:fork-spoon",
      route: "/orders",
    },
    {
      label: "Invoices",
      icon: "basil:invoice-outline",
      route: "/invoices",
    },

    // {
    //   label: "Kitchen",
    //   icon: "solar:chef-hat-minimalistic-outline",
    //   route: "/invoices",
    // },
    {
      label: "Users",
      icon: "heroicons:users",
      route: "/users",
    },
    {
      label: "Settings",
      icon: "stash:screw-nut",
      route: "/settings",
    },
  ];
};

const LoggedOutSection = () => {
  return (
    <div className="h-dvh w-dvw flex items-center justify-center">
      <p>
        Session expired please{" "}
        <NavLink to="/" className=" underline text-lime-600">
          click here
        </NavLink>{" "}
        to login
      </p>
    </div>
  );
};
export default function MainLayout() {
  const auth: AuthStateLoggedIn = useAppSelector((state) => state.auth as AuthStateLoggedIn);

  if (auth.loading) {
    return <SplashPage />;
  }

  if (!auth.loggedIn) {
    return <LoggedOutSection />;
  }

  return (
    <div className="grid h-dvh grid-rows-[60px_1fr]">
      <div className="border-b h-full">
        <div className="flex  gap-4 h-full">
          <div className="logo italic flex h-full font-bold text-xl text-lime-800 px-4 py-3 items-center font-mono">{auth.user.restaurant?.name}</div>
          <MainNav items={getMenu(auth.user)} />
          <AccountButton />
        </div>
      </div>
      <div className="h-full bg-gray-100 overflow-auto ">
        <div className="h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
