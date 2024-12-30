import { Outlet } from "react-router";

import { AuthStateLoggedIn } from "@app/store/slices/auth";
import { useAppSelector } from "@app/store";

import { MainNav } from "./MainNav";
import AccountButton from "./AccountButton";

const mainmenu = [
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

  // {
  //   label: "Kitchen",
  //   icon: "solar:chef-hat-minimalistic-outline",
  //   route: "/orders",
  // },
  {
    label: "Table",
    icon: "hugeicons:floor-plan",
    route: "/location-scout",
  },
  {
    label: "Users",
    icon: "mynaui:users-group",
    route: "/users",
  },
  {
    label: "Settings",
    icon: "stash:screw-nut",
    route: "/settings",
  },
];

export default function MainLayout() {
  const auth: AuthStateLoggedIn = useAppSelector(
    (state) => state.auth as AuthStateLoggedIn
  );
  return (
    <div className="grid h-dvh grid-rows-[60px_1fr]">
      <div className="flex border-b gap-4">
        <div className="logo italic flex h-full font-bold text-xl text-blue-800 px-4 py-3 items-center font-mono">
          {auth.user.restaurant?.name}
        </div>
        <MainNav items={mainmenu} />
        <AccountButton />
      </div>
      <div className="h-full bg-gray-100 overflow-auto ">
        <Outlet />
      </div>
    </div>
  );
}
