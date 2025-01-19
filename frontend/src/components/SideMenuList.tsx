import { Icon } from "@iconify/react";
import { Link } from "@tanstack/react-router";

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
            <Link
              to={item.route}
              className={`flex py-2 px-3 items-center justify-start gap-2 cursor-pointer transition-all hover:bg-indigo-600/15 text-indigo-950 rounded-full [&.active]:text-indigo-700 [&.active]:bg-indigo-600/10`}
            >
              <Icon icon={item.icon} height={20} width={20} />
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
