import Formatter from "@app/lib/formatter";
import { ResponsiveContainer, Tooltip, ComposedChart, XAxis, Bar } from "recharts";
import { TooltipProps } from 'recharts';
// for recharts v2.1 and above
import {
    ValueType,
    NameType,
} from 'recharts/types/component/DefaultTooltipContent';

const CustomToolTip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    if (!active || !payload) {
      return null;
    }
    return (
      <div
        className="bg-white border rounded-lg p-2 text-sm"
      >
        <p>
          <strong>{label}</strong>
        </p>
        {payload.map((item, i) => (
          <p key={i}>
            Sales: <strong>{Formatter.money(Number(item.value || 0))}</strong>
          </p>
        ))}
      </div>
    );
  };
export default function SalesChart({
  data = [],
}: {
  data: Array<{ name: string; value: number }>;
}) {
  return (
    <ResponsiveContainer width="100%" aspect={5} maxHeight={150}>
      <ComposedChart data={data}>
        <Bar dataKey="value" fill="#65A30D9f" radius={10}/>
        <Tooltip content={<CustomToolTip/>}/>
        <XAxis dataKey="name" fontFamily="Fira Sans" fontSize={12} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
