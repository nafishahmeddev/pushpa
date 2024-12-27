import { NavLink, Outlet, useNavigate } from "react-router";
import { Icon } from "@iconify/react";
import ScrollView from "../ScrollView";
import { AuthStateLoggedIn } from "@app/store/slices/auth";
import { useAppSelector } from "@app/store";
import AuthApi from "@app/services/auth";

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
          <li key={`item-${index}`} className="px-2">
            <NavLink
              to={item.route}
              className={({ isActive }) =>
                `flex py-2 px-3 items-center justify-start gap-2 cursor-pointer transition-all hover:bg-green-800/15 text-emerald-950 rounded-full ${
                  isActive ? "text-green-800 bg-green-600/10" : ""
                }`
              }
            >
              <Icon icon={item.icon} height={20} width={20} />
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function MainLayout() {
  const navigate = useNavigate();
  const auth: AuthStateLoggedIn = useAppSelector(
    (state) => state.auth as AuthStateLoggedIn
  );
  return (
    <div className="h-dvh grid grid-cols-[250px_1fr] grid-rows-1 bg-gray-100">
      <div className="bg-white border-e h-full grid grid-rows-[60px_1fr_60px]">
        <div className="logo italic flex h-full items-center font-bold text-lg text-emerald-800 px-2 py-3">
          PUSHPA DHABA
        </div>
        <ScrollView>
          <SideMenuList items={mainmenu} />
          <h3 className="px-4 text-gray-500 mt-3">Back office</h3>
          <SideMenuList items={backendMenu} />
          <div className="flex-1 items-end">
            <ul className="py-2 flex flex-col gap-1">
              <li className="px-2">
                <a
                  onClick={()=>AuthApi.logout().then(()=>{
                    navigate("/");
                  })}
                  className="flex py-2 px-3 items-center justify-start gap-2 cursor-pointer transition-all hover:bg-green-800/15 rounded-full text-red-700"
                >
                  <Icon icon="mage:logout" height={20} width={20} />
                  <span>Logout</span>
                </a>
              </li>
            </ul>
          </div>
        </ScrollView>
      </div>
      <div className="h-full grid grid-rows-[60px_1fr]">
        <div className="h-full bg-white border-b flex justify-between p-4 py-3 ">
          <div className=" bg-gray-200 rounded-full items-center flex px-3">
            <span className="text-gray-400">
              <Icon icon="tabler:search" height={20} width={20} />
            </span>
            <input
              className="bg-transparent outline-none px-2 h-full w-60"
              placeholder="Search"
            />
          </div>

          <button
            className=" bg-gray-200 rounded-full items-center flex p-0.5 gap-2 pe-2"
            onClick={console.log}
          >
            <div className="h-full aspect-square rounded-full bg-white border flex items-center justify-center">
              <Icon icon="prime:user" height={24} width={24} />
            </div>
            <div className="flex items-start justify-center flex-col">
              <span className="text-sm">{auth.user.name}</span>
            </div>

            {/* <span className="text-gray-400">
              <Icon icon="formkit:down" height={20} width={20} />
            </span> */}
          </button>
        </div>
        <div className="h-full overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
