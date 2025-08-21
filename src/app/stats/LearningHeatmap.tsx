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

  // Funkcja do formatowania daty w bardziej przyjazny sposób
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <Card className="p-6 shadow-xl rounded-2xl bg-indigo-900 text-white">
      <h2 className="text-xl font-bold mb-4">📅 Ostatnie 30 dni</h2>
      
      {/* Legenda kolorów */}
      <div className="flex items-center gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-400" />
          <span>Aktywność</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-indigo-700" />
          <span>Brak aktywności</span>
        </div>
      </div>

      {/* Kalendarz heatmap */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, i) => (
          <div
            key={i}
            title={`${formatDate(day.date)}: ${day.active ? 'Aktywny' : 'Brak aktywności'}`}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-lg ${
              day.active 
                ? "bg-green-400 hover:bg-green-300 text-indigo-900 font-bold" 
                : "bg-indigo-700 hover:bg-indigo-600 text-gray-300"
            }`}
          >
            {new Date(day.date).getDate()}
          </div>
        ))}
      </div>

      {/* Etykiety dni tygodnia (opcjonalnie) */}
      <div className="grid grid-cols-7 gap-2 mt-2 text-xs text-center text-indigo-200">
        <span>Pon</span>
        <span>Wt</span>
        <span>Śr</span>
        <span>Czw</span>
        <span>Pt</span>
        <span>Sob</span>
        <span>Niedz</span>
      </div>

      {/* Statystyki podsumowujące */}
      <div className="mt-4 pt-4 border-t border-indigo-700">
        <div className="flex justify-between items-center text-sm">
          <span>Aktywne dni:</span>
          <span className="font-bold text-yellow-400">
            {days.filter(day => day.active).length} / 30
          </span>
        </div>
        <div className="flex justify-between items-center text-sm mt-1">
          <span>Wskaźnik aktywności:</span>
          <span className="font-bold text-yellow-400">
            {Math.round((days.filter(day => day.active).length / 30) * 100)}%
          </span>
        </div>
      </div>
    </Card>
  );
}