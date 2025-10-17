"use client";
import { PieLabelRenderProps } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = [
  'var(--chart-generic-1)',
  'var(--chart-generic-2)',
  'var(--chart-generic-3)',
  'var(--chart-generic-4)'
];

export default function ChartContainer({ data, type }: { data: any[]; type: 'time' | 'accuracy' }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-[var(--muted-foreground)]">
        Brak danych do wyświetlenia
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      {type === 'time' ? (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-border)" strokeOpacity={0.3} />
          <XAxis dataKey="date" stroke="var(--chart-axis)" />
          <YAxis stroke="var(--chart-axis)" label={{ value: 'Minuty', angle: -90, position: 'insideLeft' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--chart-surface)',
              border: '1px solid var(--chart-border)',
              borderRadius: '0.5rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          />
          <Bar 
            dataKey="time" 
            name="Czas nauki (min)" 
            fill="var(--chart-generic-1)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      ) : (
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="var(--chart-generic-1)"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }: PieLabelRenderProps) =>
  `${name}: ${percent !== undefined ? (percent * 100).toFixed(0) : '0'}%`
}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--chart-surface)',
              border: '1px solid var(--chart-border)',
              borderRadius: '0.5rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          />
          <Legend />
        </PieChart>
      )}
    </ResponsiveContainer>
  );
}