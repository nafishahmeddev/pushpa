import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
type QuantityButtonProps = {
  onAdd: () => void;
  quantity: number;
  onRemove: () => void;
  onUpdate: (quantity: number) => void;
};
export default function QuantityButton({
  onAdd,
  quantity,
  onRemove,
  onUpdate,
}: QuantityButtonProps) {
  const [qtd, setQtd] = useState(quantity);

  useEffect(() => {
    setQtd(quantity);
  }, [quantity]);
  return (
    <div className="flex items-center justify-center bg-slate-100 rounded-full p-0.5">
      <button
        className="bg-emerald-700 hover:bg-emerald-600 text-white rounded-full h-5 aspect-square flex items-center justify-center"
        onClick={onRemove}
      >
        <Icon icon="ic:baseline-remove" />
      </button>
      <input
        className="text-center  font-mono flex-1 bg-transparent min-w-8 max-w-8 appearance-none"
        value={qtd}
        onChange={(e) => setQtd(Number(e.target.value.replace(/\D/g, "")))}
        onBlur={() => onUpdate(qtd)}
      />
      <button
        className="bg-emerald-700 hover:bg-emerald-600 text-white rounded-full h-5 aspect-square flex items-center justify-center"
        onClick={onAdd}
      >
        <Icon icon="ic:baseline-add" />
      </button>
    </div>
  );
}
