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
    <div className="h-full grid grid-rows-[auto_1fr]">
      <div className="bg-white border border-t-0 rounded-b-2xl h-min">
        <ul className="flex flex-row rounded-2xl overflow-hidden justify-center">
          {items.map((item, index) => (
            <li key={`item-${index}`}>
              <NavLink to={item.route} className={({ isActive }) => `flex py-1 border-y-2 border-transparent px-3 items-center justify-start gap-2 cursor-pointer hover:opacity-50 ${isActive ? "text-lime-600 border-b-lime-600" : "text-lime-950"}`}>
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
