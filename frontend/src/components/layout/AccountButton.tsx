import { Icon } from "@iconify/react";
import AuthApi from "@app/services/auth";
import { useNavigate } from "react-router";
import { useAppSelector } from "@app/store";
import { AuthStateLoggedIn } from "@app/store/slices/auth";
import { useState } from "react";

export default function AccountButton() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const auth: AuthStateLoggedIn = useAppSelector(
    (state) => state.auth as AuthStateLoggedIn
  );
  return (
    <div className="px-2 h-full py-2 relative">
      <div className="bg-gray-200 rounded-full items-center flex p-0.5 gap-2 w-full h-full">
        <button
          className={`h-full aspect-square rounded-full bg-white border flex items-center justify-center `}
          onClick={() => setShow(true)}
        >
          <Icon icon="prime:user" height={24} width={24} />
        </button>

        <div
          className={`${
            show ? "visible" : "collapse"
          } absolute top-full right-2 w-52 z-50 `}
          onBlur={() => setShow(false)}
          onMouseLeave={() => setShow(false)}
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
              <div>
                <span className="block">{auth.user.name}</span>
                <small className="block">{auth.user.designation}</small>
              </div>
            </div>
            <div className="border-t">
              <button
                className=" text-red-700  hover:opacity-50 px-3 py-2 flex gap-2 items-center"
                onClick={() => {
                  AuthApi.logout().then(() => {
                    navigate("/");
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
