"use client";

import { useEffect, useState } from "react";

import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";
import { isAuthSessionMissingError } from "@/lib/authErrorUtils";

import { statsCardClass, subtleTextClass } from "./cardStyles";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface SessionData {
  date: string;
  minutes: number;
}

export default function ActivityChart() {
  const [sessions, setSessions] = useState<SessionData[]>([]);

  useEffect(() => {
    const fetchSessions = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        if (!isAuthSessionMissingError(error)) {
          console.error("Nie udało się pobrać sesji użytkownika:", error);
        }
        return;
      }

      if (!user) return;

      const { data, error: metricsError } = await supabase
        .from("daily_metrics")
        .select("metrics_date, total_time_seconds")
        .eq("user_id", user.id)
        .order("metrics_date", { ascending: true })
        .limit(90);

      if (metricsError || !data) return;

      const formatted = data.map((row) => ({
        date: new Date(row.metrics_date).toLocaleDateString("pl-PL", {
          day: "2-digit",
          month: "2-digit",
        }),
        minutes: Math.round((row.total_time_seconds ?? 0) / 60),
      }));

      setSessions(formatted);
    };

    fetchSessions();
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
      return (
        <div className="rounded-xl border border-white/10 bg-[#030712]/90 px-4 py-3 text-slate-100 shadow-xl backdrop-blur-xl">
          <p className="text-sm font-semibold text-slate-200">{label}</p>
          <p className="text-sm text-[#93C5FD]">Czas: {payload[0].value} min</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={statsCardClass}>
      <div>
        <h2 className="text-xl font-semibold tracking-wide">Aktywność użytkownika</h2>
        <p className={subtleTextClass}>Łączny czas nauki dla poszczególnych dni.</p>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={sessions} margin={{ top: 20, right: 10, left: -10, bottom: 10 }}>
          <CartesianGrid stroke="#1E293B" strokeOpacity={0.3} strokeDasharray="3 3" />
          <XAxis dataKey="date" stroke="#64748B" tickLine={false} axisLine={false} />
          <YAxis stroke="#64748B" tickLine={false} axisLine={false} tickFormatter={(value) => `${value} min`} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(148, 163, 184, 0.1)" }} />
          <Legend wrapperStyle={{ color: "#94A3B8" }} />
          <Bar
            dataKey="minutes"
            name="Czas aktywności (min)"
            fill="url(#activityGradient)"
            radius={[10, 10, 0, 0]}
          />
          <defs>
            <linearGradient id="activityGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#1D4ED8" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#1E3A8A" stopOpacity={0.7} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
      <p className="text-center text-xs uppercase tracking-[0.3em] text-[#64748B]">
        Regularność to klucz do sukcesu
      </p>
    </Card>
  );
}
