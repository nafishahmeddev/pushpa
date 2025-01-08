import MainNavStore from "@app/store/main-nav";
import { Icon } from "@iconify/react";

export default function NavButton() {
  return (
    <button
      className="flex md:hidden h-full items-center ps-4 text-center text-2xl hover:opacity-60"
      onClick={MainNavStore.open}
    >
      <Icon icon="basil:menu-outline" />
    </button>
  );
}
