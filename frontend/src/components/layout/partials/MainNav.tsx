import { Icon } from "@iconify/react";
import { Link } from "@tanstack/react-router";

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
          <Link
            to={item.route}
            className={`h-full flex py-2 px-3 items-center justify-start gap-2 cursor-pointer transition-all  border-y-2 border-transparent 
                  [&.active]:text-lime-700 [&.active]:border-b-lime-700 text-lime-950
                }`}
          >
            <Icon icon={item.icon} height={20} width={20} />
            <span>{item.label}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
