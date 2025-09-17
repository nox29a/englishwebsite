"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#EF4444", "#10B981"]; // czerwony/błędy, zielony/poprawne

export default function MistakesChart() {
  const [stats, setStats] = useState<any[]>([]);

  useEffect(() => {
    const fetchAttempts = async () => {
      const { data, error } = await supabase
        .from("question_attempts")
        .select("is_correct");

      if (!error && data) {
        const correct = data.filter((d) => d.is_correct).length;
        const incorrect = data.length - correct;
        setStats([
          { name: "Poprawne", value: incorrect },
          { name: "Błędne", value: correct },
        ]);
      }
    };
    fetchAttempts();
  }, []);

  return (
    <Card className="p-6 shadow-xl rounded-2xl bg-indigo-900">
      <h2 className="text-xl font-bold mb-4 text-center">✅ poprawne odpowiedzi vs ❌ błędne odpowiedzi</h2>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={stats}
            dataKey="value"
            outerRadius={100}
            label
          >
            {stats.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
