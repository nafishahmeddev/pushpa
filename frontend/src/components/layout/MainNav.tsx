import { NavLink } from "react-router";
import { Icon } from "@iconify/react";

type MainNavProps = {
  items: Array<{
    label: string;
    route: string;
    icon: string;
  }>;
};
export function MainNav({ items }: MainNavProps) {
  return (
      <ul className="flex-1 flex h-full items-stretch justify-end">
        {items.map((item, index) => (
          <li key={`item-${index}`}>
            <NavLink
              to={item.route}
              className={({ isActive }) =>
                `h-full flex py-2 px-3 items-center justify-start gap-2 cursor-pointer transition-all  border-y-2 border-transparent ${
                  isActive ? "text-fuchsia-700 border-b-fuchsia-700" : "text-fuchsia-950"
                }`
              }
            >
              <Icon icon={item.icon} height={20} width={20} />
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
 
  );
}
