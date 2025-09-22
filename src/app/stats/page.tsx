"use client";
import { useState, useEffect } from "react";
import Leaderboard from "./Leaderboard";
import MistakesChart from "./MistakesChart";
import ActivityChart from "./ActivityChart";
import LearningHeatmap from "./LearningHeatmap";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import StreakCounter from "./StreakCounter";
import ErrorStatistics from "./Mistakes";

import SessionLengthDistribution from "./SessionLengthDistribution";

import VocabularyGrowth from "./VocabularyGrowth";
import AccuracyTrend from "./AccuracyTrend";
import TimeOfDayPerformance from "./TimeOfDayPerformance";

export default function StatsPage() {
  const [userType, setUserType] = useState<null | string>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserType = async () => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          router.push("/login");
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("user_type")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        setUserType(data?.user_type || "free");
      } catch (err) {
        console.error("Błąd pobierania typu użytkownika:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserType();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        Ładowanie statystyk...
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="relative p-6 md:p-12 bg-gray-900 min-h-screen overflow-hidden">
        {/* <div className="inset-0 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div className="absolute top-0 -left-40 w-32 h-full bg-white opacity-[0.03] transform -skew-x-12 animate-shimmer-slow blur-md"></div>
            <Leaderboard />
            <StreakCounter/>
            {/* ✅ Leaderboard (dostępny dla wszystkich) */}

            {/* ✅ MistakesChart (dostępny dla wszystkich) */}
            <MistakesChart />
            <ErrorStatistics />

            {/* ✅ Aktywność */}
            {userType === "premium" ? (
              <ActivityChart />
            ) : (
              <div className="flex flex-col items-center justify-center bg-gray-800 rounded-2xl p-6 text-center text-white shadow-lg">
                <p className="text-lg font-semibold mb-3">
                  Statystyki aktywności dostępne tylko dla użytkowników premium 🚀
                </p>
                <button
                  onClick={() => router.push("/upgrade")}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-xl font-semibold"
                >
                  Przejdź na Premium
                </button>
              </div>
            )}

            {/* ✅ Heatmapa nauki */}
            {userType === "premium" ? (
              <LearningHeatmap />
            ) : (
              <div className="flex flex-col items-center justify-center bg-gray-800 rounded-2xl p-6 text-center text-white shadow-lg">
                <p className="text-lg font-semibold mb-3">
                  Heatmapa nauki dostępna tylko dla użytkowników premium 🔥
                </p>
                <button
                  onClick={() => router.push("/upgrade")}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-xl font-semibold"
                >
                  Przejdź na Premium
                </button>

              </div>
      )}
            <SessionLengthDistribution />
<VocabularyGrowth />
<AccuracyTrend />
<TimeOfDayPerformance />
          </div>


        </div> */}
      </main>

      <style jsx>{`
        @keyframes shimmer-slow {
          0% {
            left: -40%;
          }
          100% {
            left: 140%;
          }
        }
        .animate-shimmer-slow {
          animation: shimmer-slow 6s infinite ease-in-out;
        }
      `}</style>
    </>
  );
}
