"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  PieLabelRenderProps,
} from "recharts";

type ChartType = "bar" | "line" | "pie" | "accuracy";

interface ChartContainerProps {
  data: { name: string; value: number }[];
  type: ChartType;
}

const COLORS = [
  "var(--chart-generic-1)",
  "var(--chart-generic-2)",
  "var(--chart-generic-3)",
  "var(--chart-generic-4)",
];

const tooltipStyles = {
  backgroundColor: "var(--chart-surface)",
  border: "1px solid var(--chart-border)",
  borderRadius: "0.5rem",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
};

export default function ChartContainer({ data, type }: ChartContainerProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-[var(--muted-foreground)]">
        Brak danych do wyświetlenia
      </div>
    );
  }

  const renderBarChart = (showPercentageAxis = false) => (
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-border)" strokeOpacity={0.3} />
      <XAxis dataKey="name" stroke="var(--chart-axis)" tick={{ fill: "var(--chart-axis)" }} />
      <YAxis
        stroke="var(--chart-axis)"
        tick={{ fill: "var(--chart-axis)" }}
        domain={showPercentageAxis ? [0, 100] : ["auto", "auto"]}
        unit={showPercentageAxis ? "%" : undefined}
      />
      <Tooltip contentStyle={tooltipStyles} />
      <Bar dataKey="value" fill="var(--chart-generic-1)" radius={[6, 6, 0, 0]} />
    </BarChart>
  );

  const renderLineChart = () => (
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-border)" strokeOpacity={0.3} />
      <XAxis dataKey="name" stroke="var(--chart-axis)" tick={{ fill: "var(--chart-axis)" }} />
      <YAxis stroke="var(--chart-axis)" tick={{ fill: "var(--chart-axis)" }} />
      <Tooltip contentStyle={tooltipStyles} />
      <Line
        type="monotone"
        dataKey="value"
        stroke="var(--chart-generic-1)"
        strokeWidth={3}
        dot={{ stroke: "var(--chart-generic-1)", strokeWidth: 2 }}
        activeDot={{ r: 6 }}
      />
    </LineChart>
  );

  const renderPieChart = () => (
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        outerRadius={90}
        fill="var(--chart-generic-1)"
        dataKey="value"
        nameKey="name"
        label={({ name, percent }: PieLabelRenderProps) =>
          `${name}: ${percent !== undefined ? Math.round(percent * 100) : 0}%`
        }
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip contentStyle={tooltipStyles} />
      <Legend />
    </PieChart>
  );

  return (
    <ResponsiveContainer width="100%" height={300}>
      {type === "pie"
        ? renderPieChart()
        : type === "line"
        ? renderLineChart()
        : renderBarChart(type === "accuracy")}
    </ResponsiveContainer>
  );
}