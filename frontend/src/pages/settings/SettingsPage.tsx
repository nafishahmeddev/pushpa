import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router";

const items = [
  {
    label: "Categories",
    icon: "clarity:file-group-line",
    route: "/settings/categories",
  },

  {
    label: "Products",
    icon: "bytesize:book",
    route: "/settings/products",
  },

  {
    label: "Locations",
    icon: "hugeicons:floor-plan",
    route: "/settings/locations",
  },

  {
    label: "Tables",
    icon: "solar:armchair-outline",
    route: "/settings/tables",
  },
];
export default function MenuPage() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (pathname == "/settings") {
      navigate("/settings/categories");
    }
  }, [pathname]);
  return (
    <div className="h-full grid grid-cols-[auto_1fr]">
      <div className="bg-white border rounded-2xl w-[200px] h-min my-4">
        <ul className="flex flex-col rounded-2xl overflow-hidden p-3 gap-2">
          {items.map((item, index) => (
            <li key={`item-${index}`}>
              <NavLink to={item.route} className={({ isActive }) => `flex rounded-2xl py-2 px-3 items-center justify-start gap-2 cursor-pointer transition-all hover:bg-lime-600/15 text-lime-950 ${isActive ? "text-lime-700 bg-lime-600/10" : ""}`}>
                <Icon icon={item.icon} height={20} width={20} />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <div className="h-full overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
