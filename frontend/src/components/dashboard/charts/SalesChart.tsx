import { ResponsiveContainer, Tooltip, ComposedChart, Bar, XAxis } from "recharts";

export default function SalesChart({
  data = [],
}: {
  data: Array<{ name: string; value: number }>;
}) {
  return (
    <ResponsiveContainer width="100%" aspect={5} maxHeight={150}>
      <ComposedChart data={data}>
        <Bar dataKey="value" fill="#413ea0" />
        <Tooltip />
        <XAxis dataKey="name" fontFamily="Fira Sans" fontSize={12} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
