import { ResponsiveContainer, Tooltip, ComposedChart, XAxis, Bar } from "recharts";

export default function SalesChart({
  data = [],
}: {
  data: Array<{ name: string; value: number }>;
}) {
  return (
    <ResponsiveContainer width="100%" aspect={5} maxHeight={150}>
      <ComposedChart data={data}>
        <Bar dataKey="value" fill="#65A30D9f" />
        <Tooltip />
        <XAxis dataKey="name" fontFamily="Fira Sans" fontSize={12} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
