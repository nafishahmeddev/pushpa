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
      <div className={`flex items-center justify-center ${loading ? "animate-pulse" : ""}`}>
        <button className={`border rounded-full h-6 aspect-square flex items-center justify-center hover:opacity-50 ${quantity == 1 ? "text-red-700" : ""}`} onClick={handleOnRemove}>
          <Icon icon={quantity == 1 ? "fluent:delete-12-regular" : "ic:baseline-remove"} />
        </button>
        <input className="text-center  font-mono flex-1 bg-transparent min-w-8 max-w-8 appearance-none" value={qtd} onChange={(e) => setQtd(Number(e.target.value.replace(/\D/g, "")))} onBlur={() => handleOnUpdate(qtd)} />
        <button className="border rounded-full h-6 aspect-square flex items-center justify-center hover:opacity-50" onClick={handleOnAdd}>
          <Icon icon="ic:baseline-add" />
        </button>
      </div>
    </fieldset>
  );
}
