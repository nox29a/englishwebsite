"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";

export default function LearningHeatmap() {
  const [days, setDays] = useState<{ date: string; active: boolean }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("user_sessions")
        .select("login_at");

      if (error || !data) return;

      const activeDays = new Set(
        data.map((s) => new Date(s.login_at).toDateString())
      );

      const today = new Date();
      const last30days: { date: string; active: boolean }[] = [];

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

  return (
    <Card className="p-6 shadow-xl rounded-2xl bg-indigo-900">
      <h2 className="text-xl font-bold mb-4">📅 Ostatnie 30 dni</h2>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => (
          <div
            key={i}
            title={day.date}
            className={`w-6 h-6 rounded ${
              day.active ? "bg-green-500" : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      <p className="text-gray-500 mt-3 text-sm">
        Zielone dni = aktywność w aplikacji
      </p>
    </Card>
  );
}
