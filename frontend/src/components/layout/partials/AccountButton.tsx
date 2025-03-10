import { Icon } from "@iconify/react";
import AuthApi from "@app/services/auth";
import { useRef, useState } from "react";
import { AuthStateLoggedIn, useAuthStore } from "@app/store/auth";
import { Link, useNavigate } from "@tanstack/react-router";
import { useClickOutside } from "@app/hooks/useClickOutside";

export default function AccountButton() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const [auth] = useAuthStore<AuthStateLoggedIn>();
  const ref = useRef(null);
  useClickOutside(ref, () => setShow(false));
  return (
    <div className="px-2 h-full aspect-square py-2 relative">
      <div className="bg-gray-200 rounded-full items-center flex p-0.5 gap-2 w-full h-full">
        <button
          className={`h-full aspect-square rounded-full bg-white border flex items-center justify-center `}
          onClick={() => setShow(true)}
          ref={ref}
        >
          <Icon icon="prime:user" height={24} width={24} />
        </button>

        <div
          className={`${
            show
              ? "visible top-full opacity-100"
              : "collapse top-[70px] opacity-0"
          } absolute right-2 min-w-52 z-50 transition-all`}
        >
          <div
            className={`border rounded-xl py-4 flex flex-col gap-3 bg-white mt-3`}
          >
            <div className="px-3 flex items-center gap-2">
              <div
                className={`h-10 aspect-square rounded-full bg-white border flex items-center justify-center `}
              >
                <Icon icon="prime:user" height={24} width={24} />
              </div>
              <div className="text-nowrap">
                <span className="block">{auth.user.name}</span>
                <small className="block">{auth.user.designation}</small>
              </div>
            </div>
            <div className="border-t">
              <Link
                to="/profile"
                className=" text-gray-700  hover:opacity-50 px-3 py-2 flex gap-2 items-center"
              >
                <Icon
                  icon="iconamoon:profile-circle-light"
                  height={20}
                  width={20}
                />
                <span>Profile</span>
              </Link>
              <button
                className=" text-red-700  hover:opacity-50 px-3 py-2 flex gap-2 items-center w-full"
                onClick={() => {
                  AuthApi.logout().then(() => {
                    navigate({ to: "/" });
                  });
                }}
              >
                <Icon icon="mage:logout" height={20} width={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
