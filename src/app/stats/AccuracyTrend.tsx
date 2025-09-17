"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import dayjs from "dayjs";

export default function AccuracyTrend() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const { data: attempts } = await supabase
        .from("question_attempts")
        .select("is_correct, created_at");

      if (!attempts) return;

      // grupowanie dzienne
      const grouped: Record<string, { correct: number; total: number }> = {};
      attempts.forEach((a) => {
        const day = dayjs(a.created_at).format("YYYY-MM-DD");
        if (!grouped[day]) grouped[day] = { correct: 0, total: 0 };
        grouped[day].total++;
        if (a.is_correct) grouped[day].correct++;
      });

      const formatted = Object.entries(grouped)
        .sort(([a], [b]) => (a > b ? 1 : -1))
        .map(([date, { correct, total }]) => ({
          date,
          accuracy: Math.round((correct / total) * 100),
        }));

      setData(formatted);
    };

    loadData();
  }, []);

  return (
    <div className="bg-indigo-900 p-4 rounded-2xl shadow-md">
      <h2 className="text-xl font-bold mb-2">Trend Skuteczności</h2>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <XAxis dataKey="date" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Area type="monotone" dataKey="accuracy" stroke="#4ade80" fill="#4ade80" fillOpacity={0.3} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
