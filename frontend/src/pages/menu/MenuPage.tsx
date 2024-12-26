import { NavLink, Outlet } from "react-router";
export default function MenuPage() {
  return (
    <div className="h-full grid grid-rows-[40px_1fr]">
      <div className="flex bg-emerald-700 text-white">
        <NavLink
          to={"/menu/categories"}
          className={({ isActive }) =>
            `flex px-4 h-full  items-center justify-center gap-2 cursor-pointer transition-all hover:bg-green-800/15 border-b-2 ${
              isActive ? "border-b-white" : "border-b-transparent"
            }`
          }
        >
          <span>Categories</span>
        </NavLink>

        <NavLink
          to={"/menu/products"}
          className={({ isActive }) =>
            `flex px-4 h-full  items-center justify-center gap-2 cursor-pointer transition-all hover:bg-green-800/15 border-b-2 ${
              isActive ? "border-b-white" : "border-b-transparent"
            }`
          }
        >
          <span>Products</span>
        </NavLink>
      </div>
      <div className="h-full overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
