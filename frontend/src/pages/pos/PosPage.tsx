import Formatter from "@app/lib/formatter";
import CartsApi from "@app/services/carts";
import { ICart } from "@app/types/cart";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router";
import {Icon}from "@iconify/react";
export default function PosPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [carts, setCarts] = useState<Array<ICart>>([]);

  const refresh = () => {
    const promise = CartsApi.all();
    return promise;
  };
  const handleNewCart = () => {
    const promise = CartsApi.create()
      .then((item) => {
        navigate("/pos/" + item.id);
        refresh().then(setCarts);
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
    toast.promise(promise, {
      loading: "please wait...",
      success: 'successful',
      error: 'something went wrong!',
    });
  };

  useEffect(() => {
    if (location.pathname == "/pos") {
      refresh().then((_items) => {
        setCarts(_items);
        if (_items.length) {
          navigate("/pos/" + _items[0].id);
        } else {
          handleNewCart();
        }
      });
    } else if (location.pathname.startsWith("/pos")) {
      refresh().then((_items) => {
        setCarts(_items);
      });
    }
  }, [location.pathname, navigate]);
  return (
    <div className="h-full grid grid-rows-[35px_1fr] m-auto">
      <div className="flex flex-row h-full gap-[1px]">
        {carts.map((cart, index) => (
          <NavLink
            key={`cart-item-${cart.id}`}
            to={"/pos/" + cart.id}
            className={({ isActive }) =>
              `py-3 flex  items-center justify-between flex-nowrap text-nowrap px-3 gap-2  hover:opacity-50   transition-all cursor-pointer
              text-sm  
            ${isActive ? "bg-blue-600/10 text-blue-800 border-transparent" : "bg-white"}`
            }
          >
            <strong className="">{index + 1}</strong>
            <span>{Formatter.time(cart.createdAt)}</span>
          </NavLink>
        ))}

        <button
          className="py-3 flex  items-center justify-between flex-nowrap text-nowrap px-3 gap-2  hover:opacity-50 transition-all cursor-pointer
              text-sm bg-white"
          onClick={handleNewCart}
        >
          <Icon icon="ic:baseline-add"/>
        </button>
      </div>
      <div className="h-full grid grid-cols-[auto_1fr]  m-auto w-full overflow-auto select-none border-t">
        <Outlet />
      </div>
    </div>
  );
}
