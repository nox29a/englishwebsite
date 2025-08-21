"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";

export default function StreakCounter() {
    const [streak, setStreak] = useState(0);
    const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStreak = async () => {
      const { data, error } = await supabase
        .from("user_sessions")
        .select("login_at")
        .order("login_at", { ascending: false });

      if (error || !data) return;

      // Zbierz unikalne dni, w których była nauka
      const days = [...new Set(data.map((s) => new Date(s.login_at).toDateString()))];

      let currentStreak = 0;
      let today = new Date();
      today.setHours(0, 0, 0, 0);

      for (let i = 0; i < days.length; i++) {
        const dayDate = new Date(days[i]);
        dayDate.setHours(0, 0, 0, 0);

        if (dayDate.getTime() === today.getTime()) {
          currentStreak++;
          today.setDate(today.getDate() - 1); // cofamy się o 1 dzień
        } else if (dayDate.getTime() === today.getTime() - 86400000) {
          currentStreak++;
          today.setDate(today.getDate() - 1);
        } else {
          break; // streak przerwany
        }
      }

      setStreak(currentStreak);
    };

    fetchStreak();
  }, []);






  useEffect(() => {
    const loadStats = async () => {
      const { data: sessions } = await supabase
        .from("user_sessions")
        .select("time_spent");

      const { data: attempts } = await supabase
        .from("question_attempts")
        .select("is_correct");

      if (!sessions || !attempts) return;

      const totalTime = sessions.reduce((acc, s) => acc + (s.time_spent ?? 0), 0);
      const avgSession =
        sessions.length > 0 ? totalTime / sessions.length : 0;

      const totalAttempts = attempts.length;
      const correctAttempts = attempts.filter((a) => a.is_correct).length;
      const accuracy =
        totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;

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

  if (!stats) return <p>Loading...</p>;

  return (<div className="flex">

    <Card className="p-6 shadow-xl rounded-2xl bg-indigo-900 text-center w-1/3">
      <h2 className="text-xl font-bold mb-2">🔥 Streak</h2>
      <p className="text-4xl font-extrabold text-orange-500">{streak} dni</p>
      <p className="text-gray-500 mt-2">uczenia się z rzędu</p>
    </Card>
        <div className="p-6 shadow-xl rounded-2xl bg-indigo-900 text-center w-2/3 ml-8">
      <h1 className="text-2xl font-bold mb-4">Twoje statystyki</h1>
      <ul className="space-y-2">
        <li>⏱️ Łączny czas nauki: {Math.round(stats.totalTime / 60)} min</li>
        <li>📊 Średnia długość sesji: {Math.round(stats.avgSession / 60)} min</li>
        <li>📝 Liczba sesji: {stats.totalSessions}</li>
        <li>❓ Liczba pytań: {stats.totalAttempts}</li>
        <li>✅ Poprawne odpowiedzi: {stats.correctAttempts}</li>
        <li>🎯 Skuteczność: {stats.accuracy.toFixed(1)}%</li>
      </ul>
    </div>
  </div>
  );
}
