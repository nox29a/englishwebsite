"use client";
import { PieLabelRenderProps } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function ChartContainer({ data, type }: { data: any[]; type: 'time' | 'accuracy' }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Brak danych do wyświetlenia
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      {type === 'time' ? (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" strokeOpacity={0.3} />
          <XAxis dataKey="date" stroke="#888" />
          <YAxis stroke="#888" label={{ value: 'Minuty', angle: -90, position: 'insideLeft' }} />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #eee',
              borderRadius: '0.5rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          />
          <Bar 
            dataKey="time" 
            name="Czas nauki (min)" 
            fill="#8884d8" 
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
            fill="#8884d8"
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
              backgroundColor: '#fff',
              border: '1px solid #eee',
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