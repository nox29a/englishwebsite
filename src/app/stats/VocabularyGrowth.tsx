"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import dayjs from "dayjs";

export default function VocabularyGrowth() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const { data: words } = await supabase
        .from("words_learned")
        .select("created_at");

      if (!words) return;

      // grupowanie tygodniowe
      const grouped: Record<string, number> = {};
      words.forEach((w) => {
        const week = dayjs(w.created_at).format("YYYY-[Tydz]WW");
        grouped[week] = (grouped[week] || 0) + 1;
      });

      // przeliczanie na narastająco
      let cumulative = 0;
      const formatted = Object.entries(grouped)
        .sort(([a], [b]) => (a > b ? 1 : -1))
        .map(([week, count]) => {
          cumulative += count;
          return { week, words: cumulative };
        });

      setData(formatted);
    };

    loadData();
  }, []);

  return (
    <div className="bg-indigo-900 p-4 rounded-2xl shadow-md">
      <h2 className="text-xl font-bold mb-2">Wzrost słownictwa</h2>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="words" stroke="#facc15" strokeWidth={3} dot />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
