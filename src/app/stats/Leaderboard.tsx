"use client";

import { useEffect, useState } from "react";

import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";

import { statsCardClass, subtleTextClass } from "./cardStyles";

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
}

interface LeaderboardEntry {
  points: number;
  user_id: string;
  profile: Profile | null;
}

export default function Leaderboard() {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data: leaderboardData, error: leaderboardError } = await supabase
        .from("view_xp_leaderboard")
        .select("total_xp, user_id")
        .order("total_xp", { ascending: false })
        .limit(10);

      if (leaderboardError || !leaderboardData?.length) {
        setLeaders([]);
        return;
      }

      const userIds = leaderboardData.map((entry) => entry.user_id);

      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, first_name, last_name")
        .in("id", userIds);

      setLeaders(
        leaderboardData.map((entry) => ({
          points: entry.total_xp ?? 0,
          user_id: entry.user_id,
          profile: profilesData?.find((profile) => profile.id === entry.user_id) ?? null,
        }))
      );
    };

    fetchLeaderboard();
  }, []);

  const formatUserName = (profile: Profile | null) => {
    if (!profile) {
      return "Użytkownik";
    }

    const firstName = profile.first_name?.trim();
    const lastName = profile.last_name?.trim();

    if (!firstName && !lastName) return "Użytkownik";
    if (!firstName) return lastName ?? "Użytkownik";
    if (!lastName) return firstName;
    return `${firstName} ${lastName}`;
  };

  return (
    <Card className={`${statsCardClass} overflow-hidden`}> 
      <div className="absolute inset-x-6 top-0 h-[2px] bg-gradient-to-r from-[#1D4ED8] via-[#3B82F6] to-[#1E3A8A]" />
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-wide">🏆 Ranking</h2>
        <span className="rounded-full border border-[#1D4ED8]/40 bg-[#1D4ED8]/20 px-3 py-1 text-xs uppercase tracking-wide text-[#93C5FD]">
          Top 10
        </span>
      </div>
      <p className={subtleTextClass}>Najlepsi uczniowie AxonAI z ostatnich tygodni.</p>
      <ul className="space-y-3">
        {leaders.length === 0 && (
          <li className="rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-center text-slate-300">
            Brak danych leaderboardu.
          </li>
        )}
        {leaders.map((entry, index) => (
          <li
            key={entry.user_id}
            className="group flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-4 py-3 transition-all duration-300 hover:border-[#1D4ED8]/40 hover:bg-[#1D4ED8]/10"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1D4ED8]/30 text-sm font-semibold text-[#E2E8F0]">
                {index + 1}
              </span>
              <span className="font-medium text-slate-100">{formatUserName(entry.profile)}</span>
            </div>
            <span className="text-sm font-semibold text-[#93C5FD]">{entry.points} pkt</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
