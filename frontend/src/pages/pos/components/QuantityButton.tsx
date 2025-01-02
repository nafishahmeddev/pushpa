import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
type QuantityButtonProps = {
  quantity: number;
  onUpdate: (quantity: number) => Promise<void>;
  onDelete: () => Promise<void>;
};
export default function QuantityButton({ quantity, onUpdate, onDelete }: QuantityButtonProps) {
  const [loading, setLoading] = useState(false);
  const [qtd, setQtd] = useState(quantity);

  const handleOnAdd = () => {
    setLoading(true);
    return onUpdate(quantity + 1).finally(() => {
      setLoading(false);
    });
  };

  const handleOnRemove = () => {
    setLoading(true);
    if (quantity - 1 <= 0) {
      return onDelete().finally(() => {
        setLoading(false);
      });
    } else {
      return onUpdate(quantity - 1).finally(() => {
        setLoading(false);
      });
    }
  };

  const handleOnUpdate = (quantity: number) => {
    if (quantity == 0) {
      return handleOnRemove();
    }
    setLoading(true);
    return onUpdate(quantity).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    setQtd(quantity);
  }, [quantity]);
  return (
    <fieldset disabled={loading}>
      <div className={`grid grid-cols-[20px_30px_20px] gap-[4px] justify-center items-center ${loading ? "animate-pulse" : ""}`}>
        <button className={`rounded-lg h-5 aspect-square flex items-center justify-center hover:opacity-50 text-white ${quantity == 1 ? "bg-red-500" : "bg-lime-600"}`} onClick={handleOnRemove}>
          <Icon icon={quantity == 1 ? "fluent:delete-12-regular" : "ic:baseline-remove"} />
        </button>
        <input className="text-center  font-mono flex-1 bg-transparent min-w-8 max-w-8 appearance-none rounded-lg" value={qtd} onChange={(e) => setQtd(Number(e.target.value.replace(/\D/g, "")))} onBlur={() => handleOnUpdate(qtd)} />
        <button className="rounded-lg h-5 aspect-square flex items-center justify-center hover:opacity-50 text-white bg-lime-600" onClick={handleOnAdd}>
          <Icon icon="ic:baseline-add" />
        </button>
      </div>
    </fieldset>
  );
}
