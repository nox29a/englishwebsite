"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import dayjs from "dayjs";

const COLORS = ["#34d399", "#60a5fa", "#f87171"];

export default function TimeOfDayPerformance() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const { data: attempts } = await supabase
        .from("question_attempts")
        .select("is_correct, created_at");

      if (!attempts) return;

      const buckets: Record<string, { correct: number; total: number }> = {
        "Rano (6-12)": { correct: 0, total: 0 },
        "Popołudnie (12-18)": { correct: 0, total: 0 },
        "Wieczór (18-24)": { correct: 0, total: 0 },
        "Noc (0-6)": { correct: 0, total: 0 },
      };

      attempts.forEach((a) => {
        const hour = dayjs(a.created_at).hour();
        let bucket = "Noc (0-6)";
        if (hour >= 6 && hour < 12) bucket = "Rano (6-12)";
        else if (hour >= 12 && hour < 18) bucket = "Popołudnie (12-18)";
        else if (hour >= 18 && hour < 24) bucket = "Wieczór (18-24)";

        buckets[bucket].total++;
        if (a.is_correct) buckets[bucket].correct++;
      });

      const formatted = Object.entries(buckets)
        .filter(([_, v]) => v.total > 0)
        .map(([period, { correct, total }]) => ({
          period,
          accuracy: Math.round((correct / total) * 100),
        }));

      setData(formatted);
    };

    loadData();
  }, []);

  return (
    <div className="bg-indigo-900 p-4 rounded-2xl shadow-md">
      <h2 className="text-xl font-bold mb-2">Skuteczność wg pory dnia</h2>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            dataKey="accuracy"
            nameKey="period"
            cx="50%"
            cy="50%"
            outerRadius={70}
            label
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
