import { NavLink, Outlet } from "react-router";
import { Icon } from "@iconify/react";
import ScrollView from "../ScrollView";

const mainmenu = [
  {
    label: "Dashboard",
    icon: "mage:dashboard-3",
    route: "/dash",
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
    label: "Kitchen",
    icon: "solar:chef-hat-minimalistic-outline",
    route: "/orders",
  },
];

const backendMenu = [
  {
    label: "Settings",
    icon: "stash:screw-nut",
    route: "/settings",
  },
];

type SideMenuListProps = {
  items: Array<{
    label: string;
    route: string;
    icon: string;
  }>;
};
export function SideMenuList({ items }: SideMenuListProps) {
  return (
    <div className="flex-1 items-end">
      <ul className="py-2 flex flex-col gap-1">
        {items.map((item, index) => (
          <li key={`item-${index}`}>
            <NavLink
              to={item.route}
              className={({ isActive }) =>
                `flex py-3 px-3 items-center justify-start gap-2 cursor-pointer transition-all hover:bg-green-800/15 text-emerald-950 ${
                  isActive ? "text-green-800 bg-green-600/10" : ""
                }`
              }
            >
              <Icon icon={item.icon} height={24} width={24} />
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function MainLayout() {
  return (
    <div className="h-dvh grid grid-cols-[minmax(250px,50px)_1fr] grid-rows-1 bg-gray-100">
      <div className="bg-white border-e h-full grid grid-rows-[60px_1fr_60px]">
        <div className="logo italic flex h-full items-center font-bold text-lg text-emerald-800 px-2 py-3">
          PUSHPA DHABA
        </div>
        <ScrollView>
          <SideMenuList items={mainmenu} />
          <h3 className="px-4 text-gray-500 mt-3">Back office</h3>
          <SideMenuList items={backendMenu} />
        </ScrollView>
      </div>
      <div className="h-full">
        <Outlet />
      </div>
    </div>
  );
}
