"use client";

import { useEffect, useState } from "react";

import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";
import { isAuthSessionMissingError } from "@/lib/authErrorUtils";

import { statsCardClass, subtleTextClass } from "./cardStyles";

import dayjs from "dayjs";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface AccuracyPoint {
  date: string;
  accuracy: number;
}

export default function AccuracyTrend() {
  const [data, setData] = useState<AccuracyPoint[]>([]);

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

      const { data: attempts, error: attemptsError } = await supabase
        .from("exercise_attempts")
        .select("completed_at, started_at, correct_answers, total_questions")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: true })
        .limit(120);

      if (attemptsError || !attempts?.length) return;

      const grouped: Record<string, { correct: number; total: number }> = {};

      attempts.forEach((attempt) => {
        const timestamp = attempt.completed_at ?? attempt.started_at;
        if (!timestamp) return;

        const day = dayjs(timestamp).format("YYYY-MM-DD");
        if (!grouped[day]) grouped[day] = { correct: 0, total: 0 };

        grouped[day].correct += attempt.correct_answers ?? 0;
        grouped[day].total += attempt.total_questions ?? 0;
      });

      const formatted = Object.entries(grouped)
        .filter(([, value]) => value.total > 0)
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
    <Card className={statsCardClass}>
      <div>
        <h2 className="text-xl font-semibold tracking-wide">Trend skuteczności</h2>
        <p className={subtleTextClass}>Śledź jak zmieniała się Twoja skuteczność odpowiedzi dzień po dniu.</p>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data}>
          <XAxis dataKey="date" stroke="#64748B" tickLine={false} axisLine={false} />
          <YAxis domain={[0, 100]} stroke="#64748B" tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
          <Tooltip
            contentStyle={{
              background: "rgba(3, 7, 18, 0.92)",
              borderRadius: "12px",
              border: "1px solid rgba(148, 163, 184, 0.2)",
              color: "#E2E8F0",
            }}
          />
          <defs>
            <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#0F172A" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="accuracy"
            stroke="#34D399"
            strokeWidth={3}
            fill="url(#accuracyGradient)"
            dot={{ stroke: "#34D399", strokeWidth: 2, r: 3 }}
            activeDot={{ r: 6, strokeWidth: 0, fill: "#34D399" }}
          />
        </AreaChart>
      </ResponsiveContainer>
      <p className="text-center text-xs uppercase tracking-[0.3em] text-[#64748B]">
        Cel: stabilna skuteczność powyżej 80%
      </p>
    </Card>
  );
}
