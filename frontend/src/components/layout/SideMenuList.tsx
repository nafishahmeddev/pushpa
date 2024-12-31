import { NavLink } from "react-router";
import { Icon } from "@iconify/react";

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
                `flex py-2 px-3 items-center justify-start gap-2 cursor-pointer transition-all hover:bg-lime-600/15 text-lime-950 rounded-full ${
                  isActive ? "text-lime-700 bg-lime-600/10" : ""
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
