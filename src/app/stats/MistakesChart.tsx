"use client";

import { useEffect, useState } from "react";

import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";
import { isAuthSessionMissingError } from "@/lib/authErrorUtils";

import { statsCardClass, subtleTextClass } from "./cardStyles";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface AttemptStat {
  name: string;
  value: number;
}

const COLORS = ["#EF4444", "#10B981"];

export default function MistakesChart() {
  const [stats, setStats] = useState<AttemptStat[]>([]);

  useEffect(() => {
    const fetchAttempts = async () => {
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

      const { data, error: mistakesError } = await supabase
        .from("answer_events")
        .select("is_correct")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(500);

      if (mistakesError || !data) {
        setStats([]);
        return;
      }

      const correct = data.filter((d) => d.is_correct).length;
      const incorrect = data.length - correct;

      setStats([
        { name: "Poprawne", value: correct },
        { name: "Błędne", value: incorrect },
      ]);
    };

    fetchAttempts();
  }, []);

  return (
    <Card className={`${statsCardClass} gap-6`}>
      <div>
        <h2 className="text-xl font-semibold tracking-wide">Skuteczność odpowiedzi</h2>
        <p className={subtleTextClass}>Porównanie poprawnych i błędnych odpowiedzi w quizach.</p>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie data={stats} dataKey="value" innerRadius={60} outerRadius={100} paddingAngle={4}>
            {stats.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} opacity={0.85} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(3, 7, 18, 0.9)",
              borderRadius: "12px",
              border: "1px solid rgba(148, 163, 184, 0.2)",
              color: "#E2E8F0",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-center gap-6 text-sm">
        {stats.map((entry, index) => (
          <div key={entry.name} className="flex items-center gap-2 text-slate-300">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
            {entry.name}: <span className="font-semibold text-slate-100">{entry.value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
