import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import ClientOnly from 'src/shared/components/ClientOnly';

interface BarData {
  label: string;
  value: number;
}

interface Props {
  data: BarData[];
  height?: number;
  width?: number;
}

export default function SimpleBarChart({ data, height = 240, width = 800 }: Props) {
  return (
    <ClientOnly>
      <div style={{ width, height }}>
        <BarChart width={width} height={height} data={data} margin={{ top: 10, right: 20, left: 10, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" interval={0} angle={-20} textAnchor="end" height={60} />
          <YAxis />
          <Tooltip formatter={(value: any) => typeof value === 'number' ? value.toLocaleString('es-AR') : value} />
          <Bar dataKey="value" fill="#1976d2" radius={[6,6,0,0]} />
        </BarChart>
      </div>
    </ClientOnly>
  );
}
