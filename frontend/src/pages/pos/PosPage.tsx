import CartsApi from "@app/services/carts";
import { ICart } from "@app/types/cart";
import moment from "moment";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router";
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
    <div className="h-full grid grid-rows-[40px_1fr] m-auto p-4 gap-4">
      <div className="flex flex-row h-full gap-2 ">
        {carts.map((cart, index) => (
          <NavLink
            key={`cart-item-${cart.id}`}
            to={"/pos/" + cart.id}
            className={({ isActive }) =>
              `rounded-xl py-3 flex  items-center justify-between flex-nowrap text-nowrap px-3 gap-2  hover:opacity-50  border transition-all cursor-pointer
              text-sm  
            ${isActive ? "bg-emerald-200 border-transparent" : "bg-white"}`
            }
          >
            <strong className="">#{index + 1}</strong>
            <span className="">{moment(cart.createdAt).format("hh:mm A")}</span>
          </NavLink>
        ))}

        <button
          className="rounded-xl py-3 flex  items-center justify-between flex-nowrap text-nowrap px-3 gap-2  hover:opacity-50  border transition-all cursor-pointer
              text-sm bg-white"
          onClick={handleNewCart}
        >
          + New Order
        </button>
      </div>
      <div className="h-full grid grid-cols-[450px_1fr]  m-auto w-full overflow-auto gap-4">
        <Outlet />
      </div>
    </div>
  );
}
