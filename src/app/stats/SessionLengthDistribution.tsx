"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function SessionLengthDistribution() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const { data: sessions } = await supabase
        .from("user_sessions")
        .select("time_spent");

      if (!sessions) return;

      const buckets = {
        "<5 min": 0,
        "5-15 min": 0,
        "15-30 min": 0,
        "30+ min": 0,
      };

      sessions.forEach((s) => {
        const minutes = (s.time_spent ?? 0) / 60;
        if (minutes < 5) buckets["<5 min"]++;
        else if (minutes < 15) buckets["5-15 min"]++;
        else if (minutes < 30) buckets["15-30 min"]++;
        else buckets["30+ min"]++;
      });

      setData(Object.entries(buckets).map(([length, count]) => ({ length, count })));
    };

    loadData();
  }, []);

  return (
    <div className="bg-indigo-900 p-4 rounded-2xl shadow-md">
      <h2 className="text-xl font-bold mb-2">Długości Sesji</h2>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis dataKey="length" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#38bdf8" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
