"use client";

import { useEffect, useState } from "react";

import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";
import { isAuthSessionMissingError } from "@/lib/authErrorUtils";

import { statsCardClass, subtleTextClass } from "./cardStyles";

interface SummaryStats {
  totalTime: number;
  avgSession: number;
  totalSessions: number;
  totalAttempts: number;
  correctAttempts: number;
  accuracy: number;
}

export default function StreakCounter() {
  const [streak, setStreak] = useState(0);
  const [stats, setStats] = useState<SummaryStats | null>(null);

  useEffect(() => {
    const fetchStreak = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        if (!isAuthSessionMissingError(error)) {
          console.error("Błąd pobierania sesji użytkownika:", error);
        }
        return;
      }

      if (!user) return;

      const { data: streakRow, error: streakError } = await supabase
        .from("streaks")
        .select("current_streak")
        .eq("user_id", user.id)
        .maybeSingle();

      if (streakError) {
        console.error("Błąd pobierania streaka:", streakError.message);
        return;
      }

      if (streakRow) {
        setStreak(streakRow.current_streak ?? 0);
      }
    };

    fetchStreak();
  }, []);

  useEffect(() => {
    const loadStats = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        if (!isAuthSessionMissingError(error)) {
          console.error("Błąd pobierania sesji użytkownika:", error);
        }
        return;
      }

      if (!user) return;

      const [{ data: sessions }, { data: attempts }] = await Promise.all([
        supabase
          .from("exercise_sessions")
          .select("duration_seconds")
          .eq("user_id", user.id),
        supabase
          .from("answer_events")
          .select("is_correct")
          .eq("user_id", user.id),
      ]);

      if (!sessions || !attempts) return;

      const totalTime = sessions.reduce((acc, session) => acc + (session.duration_seconds ?? 0), 0);
      const avgSession = sessions.length > 0 ? totalTime / sessions.length : 0;
      const totalAttempts = attempts.length;
      const correctAttempts = attempts.filter((attempt) => attempt.is_correct).length;
      const accuracy = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;

      setStats({
        totalTime,
        avgSession,
        totalSessions: sessions.length,
        totalAttempts,
        correctAttempts,
        accuracy,
      });
    };

    loadStats();
  }, []);

  if (!stats) {
    return (
      <Card className={statsCardClass}>
        <h2 className="text-xl font-semibold tracking-wide">Podsumowanie aktywności</h2>
        <p className={subtleTextClass}>Ładowanie danych...</p>
      </Card>
    );
  }

  const minutes = (value: number) => Math.round(value / 60);

  return (
    <Card className={`${statsCardClass} gap-8`}>
      <div className="grid gap-6 md:grid-cols-[1.2fr_2fr]">
        <div className="relative overflow-hidden rounded-2xl border border-[#1D4ED8]/30 bg-gradient-to-br from-[#1D4ED8]/30 via-[#1E3A8A]/30 to-[#0F172A]/50 p-6 text-center shadow-[0_20px_60px_rgba(29,78,216,0.25)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.25),_transparent_55%)]" />
          <div className="relative z-10">
            <h2 className="text-sm uppercase tracking-[0.4em] text-[#93C5FD]">Aktualny streak</h2>
            <p className="mt-4 text-5xl font-bold text-white">{streak}</p>
            <p className="mt-2 text-sm text-[#E2E8F0]/80">dni nauki z rzędu</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <SummaryItem label="Łączny czas" value={`${minutes(stats.totalTime)} min`} />
          <SummaryItem label="Śr. długość sesji" value={`${minutes(stats.avgSession)} min`} />
          <SummaryItem label="Liczba sesji" value={stats.totalSessions} />
          <SummaryItem label="Pytania" value={stats.totalAttempts} />
          <SummaryItem label="Poprawne" value={stats.correctAttempts} />
          <SummaryItem label="Skuteczność" value={`${stats.accuracy.toFixed(1)}%`} accent />
        </div>
      </div>
    </Card>
  );
}

interface SummaryItemProps {
  label: string;
  value: string | number;
  accent?: boolean;
}

function SummaryItem({ label, value, accent }: SummaryItemProps) {
  return (
    <div
      className={`rounded-xl border px-4 py-3 transition-colors duration-300 ${
        accent
          ? "border-[#1D4ED8]/50 bg-[#1D4ED8]/20 text-[#E0E7FF]"
          : "border-white/10 bg-white/5 text-slate-200"
      }`}
    >
      <p className="text-xs uppercase tracking-[0.3em] text-[#94A3B8]">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-100">{value}</p>
    </div>
  );
}
