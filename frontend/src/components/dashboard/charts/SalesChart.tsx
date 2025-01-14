import { ResponsiveContainer, Tooltip, ComposedChart, XAxis, Area } from "recharts";

export default function SalesChart({
  data = [],
}: {
  data: Array<{ name: string; value: number }>;
}) {
  return (
    <ResponsiveContainer width="100%" aspect={5} maxHeight={150}>
      <ComposedChart data={data}>
        <Area dataKey="value" fill="#65A30D30" strokeWidth={1} stroke="#65A30D30" />
        <Tooltip />
        <XAxis dataKey="name" fontFamily="Fira Sans" fontSize={12} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
