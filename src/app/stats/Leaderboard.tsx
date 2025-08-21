"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";

export default function Leaderboard() {
  const [leaders, setLeaders] = useState<any[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data, error } = await supabase
        .from("leaderboard")
        .select("points, user_id, profiles(first_name, last_name)")
        .order("points", { ascending: false })
        .limit(10);

      if (!error) setLeaders(data || []);
    };
    fetchLeaderboard();
  }, []);

  return (
    <Card className="p-6 shadow-xl rounded-2xl bg-indigo-900">
      <h2 className="text-xl font-bold mb-4">🏆 Ranking</h2>
      <ul className="space-y-3">
        {leaders.map((entry, i) => (
          <li
            key={i}
            className="flex justify-between items-center text-gray-700"
          >
            <span className="font-medium text-yellow-500">
              {i + 1}. {entry.profiles?.first_name} {entry.profiles?.last_name}
            </span>
            <span className="text-yellow-600 font-bold">{entry.points} pkt</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
