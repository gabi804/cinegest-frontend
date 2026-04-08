import ClientOnly from 'src/shared/components/ClientOnly';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface Point {
  x: string; // date or label
  y: number;
}

interface Props {
  data: Point[];
  width?: number;
  height?: number;
}

export default function SimpleLineChart({ data, height = 260, width = 900 }: Props) {
  return (
    <ClientOnly>
      <div style={{ width, height }}>
        <AreaChart width={width} height={height} data={data} margin={{ top: 10, right: 20, left: 10, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" angle={-20} textAnchor="end" height={60} />
          <YAxis />
          <Tooltip formatter={(value: any) => typeof value === 'number' ? value.toLocaleString('es-AR') : value} />
          <Area type="monotone" dataKey="y" stroke="#1976d2" fill="#1976d2" fillOpacity={0.12} />
        </AreaChart>
      </div>
    </ClientOnly>
  );
}
