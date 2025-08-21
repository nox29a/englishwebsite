"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ActivityChart() {
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    const fetchSessions = async () => {
      const { data, error } = await supabase
        .from("user_sessions")
        .select("time_spent, login_at")
        .order("login_at", { ascending: true });

      if (!error) {
        const formatted = data.map((s) => ({
          date: new Date(s.login_at).toLocaleDateString(),
          minutes: Math.round(s.time_spent / 60),
        }));
        setSessions(formatted);
      }
    };
    fetchSessions();
  }, []);

  return (
    <Card className="p-6 shadow-xl rounded-2xl bg-indigo-900">
      <h2 className="text-xl font-bold mb-4">📊 Twoja aktywność</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={sessions}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="minutes" fill="#1146E5" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
