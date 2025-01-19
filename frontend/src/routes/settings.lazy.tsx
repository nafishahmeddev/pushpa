import {
  createLazyFileRoute,
  Link,
  Outlet,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { Icon } from "@iconify/react";

export const Route = createLazyFileRoute("/settings")({
  component: RouteComponent,
});

const items = [
  {
    label: "Details",
    icon: "solar:info-square-linear",
    route: "/settings/details",
  },
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

export default function RouteComponent() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const refs = useRef<{ [key: string]: HTMLLIElement | undefined }>({});

  useEffect(() => {
    if (pathname == "/settings") {
      navigate({ to: "/settings/details" });
    }

    refs.current[pathname]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  }, [pathname]);
  return (
    <div className="h-full grid grid-cols-[1fr] grid-rows-[auto_1fr] md:grid-cols-[auto_1fr] md:grid-rows-[1fr]">
      <div className="bg-white border-b  md:w-[200px] overflow-x-auto md:overflow-x-visible md:border-0 md:border-e no-scrollbar">
        <div className="flex-1 items-end">
          <ul className=" flex md:py-2 md:flex-col md:gap-1">
            {items.map((item, index) => (
              <li
                key={`item-${index}`}
                className="md:px-2"
                id={"settings-menu" + item.route}
                aria-current={pathname == item.route ? "page" : "false"}
                ref={(el) => {
                  if (pathname == item.route) {
                    refs.current[item.route] = el || undefined;
                  }
                }}
              >
                <Link
                  to={item.route}
                  className={`flex py-2 px-3 items-center justify-start gap-2 cursor-pointer hover:opacity-60 text-indigo-950 md:rounded-full border-y-2 border-y-transparent [&.active]:border-b-indigo-600  md:[&.active]:border-b-transparent  [&.active]:text-indigo-700  md:[&.active]:bg-indigo-600/10`}
                >
                  <Icon icon={item.icon} height={20} width={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="h-full overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
