import { SideMenuList } from "@app/components/layout/MainLayout";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
export default function MenuPage() {
  const {pathname} = useLocation();
  const navigate = useNavigate();

  useEffect(()=>{
    if(pathname == "/settings"){
      navigate("/settings/categories");
    }

  },[pathname])
  return (
    <div className="h-full grid grid-cols-[auto_1fr]">
      <div className="bg-white border-e w-[200px]">
        <SideMenuList items={[
          {
            label:"Categories",
            icon:"fluent-mdl2:rows-group",
            route: "/settings/categories"
          },

          {
            label:"Products",
            icon:"bytesize:book",
            route: "/settings/products"
          },

          {
            label:"Users",
            icon:"mynaui:users-group",
            route: "/settings/users"
          }
        ]}/>
      </div>
      <div className="h-full overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
