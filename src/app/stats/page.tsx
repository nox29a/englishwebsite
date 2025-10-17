"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabaseClient";

import ActivityChart from "./ActivityChart";
import AccuracyTrend from "./AccuracyTrend";
import Leaderboard from "./Leaderboard";
import LearningHeatmap from "./LearningHeatmap";
import Mistakes from "./Mistakes";
import MistakesChart from "./MistakesChart";
import SessionLengthDistribution from "./SessionLengthDistribution";
import StreakCounter from "./StreakCounter";
import TimeOfDayPerformance from "./TimeOfDayPerformance";
import VocabularyGrowth from "./VocabularyGrowth";

const gradientBackground =
  "relative min-h-screen overflow-hidden bg-gradient-to-br from-[#030712] via-[#050b1f] to-black px-6 py-16 text-slate-100 md:px-12";

export default function StatsPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error || !user) {
          router.push("/login");
          return;
        }

        const { error: profileError } = await supabase
          .from("profiles")
          .select("user_type")
          .eq("id", user.id)
          .single();

        if (profileError) {
          throw profileError;
        }
      } catch (err) {
        console.error("Błąd pobierania danych użytkownika:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-[#030712] via-[#050b1f] to-black text-slate-100">
        Ładowanie statystyk...
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className={gradientBackground}>
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-[#1D4ED8]/20 blur-3xl" />
          <div className="absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-[#1E3A8A]/30 blur-[140px]" />
          <div className="absolute inset-x-0 top-0 mx-auto h-64 w-[90%] rounded-b-[4rem] border border-white/10 bg-white/5/30 opacity-40 blur-3xl" />
        </div>

        <section className="relative z-10 mx-auto flex max-w-6xl flex-col gap-12">
          <header className="flex flex-col gap-3 text-center md:text-left">
            <p className="text-sm uppercase tracking-[0.4em] text-[#94A3B8]">Panel statystyk</p>
            <h1 className="text-3xl font-semibold md:text-4xl">Analiza Twojego postępu w AxonAI</h1>
            <p className="max-w-2xl text-slate-400">
              Monitoruj swoje wyniki, tempo nauki oraz najważniejsze wskaźniki skuteczności dzięki przejrzystemu zestawowi kart i
              wykresów.
            </p>
          </header>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <Leaderboard />
            <StreakCounter />
            <ActivityChart />
            <LearningHeatmap />
            <Mistakes />
            <MistakesChart />
            <SessionLengthDistribution />
            <VocabularyGrowth />
            <AccuracyTrend />
            <TimeOfDayPerformance />
          </div>
        </section>
      </main>
    </>
  );
}
