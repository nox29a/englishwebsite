"use client";

import { useEffect, useState } from "react";

import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";
import { isAuthSessionMissingError } from "@/lib/authErrorUtils";

import { statsCardClass, subtleTextClass } from "./cardStyles";

import dayjs from "dayjs";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface VocabularyPoint {
  week: string;
  words: number;
}

export default function VocabularyGrowth() {
  const [data, setData] = useState<VocabularyPoint[]>([]);

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

      const { data: snapshots, error: snapshotsError } = await supabase
        .from("skill_snapshots")
        .select("computed_at, proficiency, evidence_count")
        .eq("user_id", user.id)
        .eq("skill_key", "vocabulary")
        .order("computed_at", { ascending: true });

      if (snapshotsError || !snapshots?.length) return;

      const grouped: Record<string, { proficiency: number; evidence: number }> = {};

      snapshots.forEach((snapshot) => {
        const week = dayjs(snapshot.computed_at).format("YYYY-[Tydz]WW");
        grouped[week] = {
          proficiency: snapshot.proficiency ?? 0,
          evidence: snapshot.evidence_count ?? 0,
        };
      });

      let cumulative = 0;
      const formatted = Object.entries(grouped)
        .sort(([a], [b]) => (a > b ? 1 : -1))
        .map(([week, value]) => {
          cumulative = Math.max(cumulative, value.evidence);
          return { week, words: cumulative };
        });

      setData(formatted);
    };

    loadData();
  }, []);

  return (
    <Card className={statsCardClass}>
      <div>
        <h2 className="text-xl font-semibold tracking-wide">Wzrost słownictwa</h2>
        <p className={subtleTextClass}>Łączna liczba nowych słówek opanowanych w kolejnych tygodniach.</p>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <XAxis dataKey="week" stroke="#64748B" tickLine={false} axisLine={false} />
          <YAxis stroke="#64748B" tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              background: "rgba(3, 7, 18, 0.92)",
              borderRadius: "12px",
              border: "1px solid rgba(148, 163, 184, 0.2)",
              color: "#E2E8F0",
            }}
          />
          <Line
            type="monotone"
            dataKey="words"
            stroke="#6366F1"
            strokeWidth={3}
            dot={{ r: 3, fill: "#6366F1", strokeWidth: 0 }}
            activeDot={{ r: 6, strokeWidth: 0, fill: "#A855F7" }}
          />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-center text-xs uppercase tracking-[0.3em] text-[#64748B]">
        Utrzymuj stały wzrost zasobu słów
      </p>
    </Card>
  );
}
