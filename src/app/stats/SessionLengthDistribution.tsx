"use client";

import { useEffect, useState } from "react";

import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";
import { isAuthSessionMissingError } from "@/lib/authErrorUtils";

import { statsCardClass, subtleTextClass } from "./cardStyles";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface SessionBucket {
  length: string;
  count: number;
}

export default function SessionLengthDistribution() {
  const [data, setData] = useState<SessionBucket[]>([]);

  useEffect(() => {
    const loadData = async () => {
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

      const { data: sessions, error: sessionsError } = await supabase
        .from("exercise_sessions")
        .select("duration_seconds")
        .eq("user_id", user.id)
        .order("started_at", { ascending: false })
        .limit(200);

      if (sessionsError || !sessions?.length) {
        setData([]);
        return;
      }

      const buckets: Record<string, number> = {
        "<5 min": 0,
        "5-15 min": 0,
        "15-30 min": 0,
        "30+ min": 0,
      };

      sessions.forEach((session) => {
        const minutes = (session.duration_seconds ?? 0) / 60;
        if (minutes < 5) buckets["<5 min"] += 1;
        else if (minutes < 15) buckets["5-15 min"] += 1;
        else if (minutes < 30) buckets["15-30 min"] += 1;
        else buckets["30+ min"] += 1;
      });

      setData(Object.entries(buckets).map(([length, count]) => ({ length, count })));
    };

    loadData();
  }, []);

  return (
    <Card className={statsCardClass}>
      <div>
        <h2 className="text-xl font-semibold tracking-wide">Długości sesji</h2>
        <p className={subtleTextClass}>Jak często Twoje sesje nauki mieszczą się w poszczególnych przedziałach czasowych.</p>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data}>
          <XAxis dataKey="length" stroke="#64748B" tickLine={false} axisLine={false} />
          <YAxis stroke="#64748B" tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              background: "rgba(3, 7, 18, 0.92)",
              borderRadius: "12px",
              border: "1px solid rgba(148, 163, 184, 0.2)",
              color: "#E2E8F0",
            }}
          />
          <Bar dataKey="count" fill="url(#distributionGradient)" radius={[8, 8, 0, 0]} />
          <defs>
            <linearGradient id="distributionGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#0F172A" stopOpacity={0.1} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
      <p className="text-center text-xs uppercase tracking-[0.3em] text-[#64748B]">
        Znajdź optymalny czas skupienia
      </p>
    </Card>
  );
}
