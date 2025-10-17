"use client";

import { useEffect, useState } from "react";

import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";
import { isAuthSessionMissingError } from "@/lib/authErrorUtils";

import { statsCardClass, subtleTextClass } from "./cardStyles";

import dayjs from "dayjs";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface PerformancePoint {
  period: string;
  accuracy: number;
}

const COLORS = ["#3B82F6", "#6366F1", "#A855F7", "#F97316"];

export default function TimeOfDayPerformance() {
  const [data, setData] = useState<PerformancePoint[]>([]);

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
        .from("answer_events")
        .select("is_correct, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(500);

      if (attemptsError || !attempts?.length) return;

      const buckets: Record<string, { correct: number; total: number }> = {
        "Rano (6-12)": { correct: 0, total: 0 },
        "Popołudnie (12-18)": { correct: 0, total: 0 },
        "Wieczór (18-24)": { correct: 0, total: 0 },
        "Noc (0-6)": { correct: 0, total: 0 },
      };

      attempts.forEach((attempt) => {
        const hour = dayjs(attempt.created_at).hour();
        let bucket = "Noc (0-6)";
        if (hour >= 6 && hour < 12) bucket = "Rano (6-12)";
        else if (hour >= 12 && hour < 18) bucket = "Popołudnie (12-18)";
        else if (hour >= 18 && hour < 24) bucket = "Wieczór (18-24)";

        buckets[bucket].total += 1;
        if (attempt.is_correct) buckets[bucket].correct += 1;
      });

      const formatted = Object.entries(buckets)
        .filter(([, value]) => value.total > 0)
        .map(([period, { correct, total }]) => ({
          period,
          accuracy: Math.round((correct / total) * 100),
        }));

      setData(formatted);
    };

    loadData();
  }, []);

  return (
    <Card className={`${statsCardClass} gap-6`}>
      <div>
        <h2 className="text-xl font-semibold tracking-wide">Skuteczność wg pory dnia</h2>
        <p className={subtleTextClass}>Określ, kiedy Twój mózg pracuje najefektywniej.</p>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            dataKey="accuracy"
            nameKey="period"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={95}
            paddingAngle={3}
          >
            {data.map((entry, index) => (
              <Cell key={entry.period} fill={COLORS[index % COLORS.length]} opacity={0.85} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => `${value}%`}
            contentStyle={{
              background: "rgba(3, 7, 18, 0.92)",
              borderRadius: "12px",
              border: "1px solid rgba(148, 163, 184, 0.2)",
              color: "#E2E8F0",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
        {data.map((entry, index) => (
          <div key={entry.period} className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
            {entry.period}: <span className="font-semibold text-slate-100">{entry.accuracy}%</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
