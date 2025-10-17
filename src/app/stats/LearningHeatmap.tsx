"use client";

import { useEffect, useState } from "react";

import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";
import { isAuthSessionMissingError } from "@/lib/authErrorUtils";

import { statsCardClass, subtleTextClass } from "./cardStyles";

interface HeatmapDay {
  date: string;
  active: boolean;
}

export default function LearningHeatmap() {
  const [days, setDays] = useState<HeatmapDay[]>([]);

  useEffect(() => {
    const fetchData = async () => {
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
        .select("metrics_date, total_attempts, total_sessions")
        .eq("user_id", user.id)
        .order("metrics_date", { ascending: false })
        .limit(60);

      if (metricsError || !data) {
        setDays([]);
        return;
      }

      const activeDays = new Set(
        data
          .filter((session) => (session.total_attempts ?? 0) > 0 || (session.total_sessions ?? 0) > 0)
          .map((session) => new Date(session.metrics_date).toDateString())
      );
      const today = new Date();
      const last30days: HeatmapDay[] = [];

      for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const label = d.toDateString();
        last30days.push({
          date: label,
          active: activeDays.has(label),
        });
      }

      setDays(last30days);
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pl-PL", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <Card className={`${statsCardClass} gap-6`}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-wide">Aktywność z 30 dni</h2>
        <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs uppercase tracking-wide text-slate-300">
          30 dni
        </span>
      </div>
      <p className={subtleTextClass}>Zobacz, w które dni utrzymywałeś regularność nauki.</p>

      <div className="grid grid-cols-6 gap-3 text-xs sm:grid-cols-10">
        {days.map((day) => (
          <div
            key={day.date}
            className={`flex h-12 flex-col justify-center rounded-xl border px-2 text-center transition-all duration-300 ${
              day.active
                ? "border-[#1D4ED8]/60 bg-gradient-to-br from-[#1D4ED8]/40 via-[#1E3A8A]/30 to-transparent text-[#E2E8F0]"
                : "border-white/10 bg-white/5 text-slate-500"
            }`}
          >
            <span className="text-[11px] uppercase tracking-wide text-slate-400">
              {formatDate(day.date)}
            </span>
            <span className={`text-sm font-semibold ${day.active ? "text-[#93C5FD]" : "text-slate-500"}`}>
              {day.active ? "●" : "–"}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#1D4ED8]/60" />
          Aktywne dni
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-white/20" />
          Przerwy w nauce
        </div>
      </div>
    </Card>
  );
}
