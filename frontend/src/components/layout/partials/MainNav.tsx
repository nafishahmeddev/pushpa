import { useMainNavStore } from "@app/store/main-nav";
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
  const [menu, setMenu] = useMainNavStore();
  return (
    <>
      <ul
        className={`flex-1 flex h-full items-stretch md:justify-end fixed top-0 w-[300px] bg-white z-50 flex-col transition-all border-e md:border-e-0 md:w-auto md:static md:bg-transparent md:flex-row md:opacity-100 ${menu.open ? "left-0 opacity-100" : "-left-[300px] opacity-60"}`}
      >
        {items.map((item, index) => (
          <li key={`item-${index}`}>
            <Link
              to={item.route}
              className={`h-full flex py-2 px-3 items-center justify-start gap-2 cursor-pointer transition-all  border-y-2 border-transparent 
                  [&.active]:text-lime-700 md:[&.active]:border-b-lime-700 text-lime-950
                }`}
            >
              <Icon icon={item.icon} height={20} width={20} />
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div
        className={`fixed top-0 left-0 bg-white/50 h-full w-full z-20 md:hidden transition-all ${menu.open?"visible":" collapse"}`}
        onClick={() => setMenu((state) => ({ ...state, open: false }))}
      ></div>
    </>
  );
}
