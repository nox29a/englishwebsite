"use client";
import Leaderboard from "./Leaderboard";
import MistakesChart from "./MistakesChart";
import ActivityChart from "./ActivityChart";
import LearningHeatmap from "./LearningHeatmap";
import Navbar from "@/components/Navbar";

export default function StatsPage() {
  return (
    <>
      <Navbar />
      <main className="relative p-6 md:p-12 bg-gray-900 min-h-screen overflow-hidden">
        {/* Efekt połysku w tle */}
        <div className=" inset-0 overflow-hidden">
        
        {/* Zawartość strony */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          <div className="absolute top-0 -left-40 w-32 h-full bg-white opacity-[0.03] transform -skew-x-12 animate-shimmer-slow blur-md"></div>
          {/* ✅ Leaderboard */}
          <Leaderboard />

          {/* ✅ Aktywność */}
          <ActivityChart />

          {/* ✅ Analiza błędów */}
          <MistakesChart />
          
          {/* ✅ Heatmapa nauki */}
          <LearningHeatmap />
        </div>
        </div>
      </main>

            <style jsx>{`
        @keyframes shimmer-slow {
          0% { left: -40%; }
          100% { left: 140%; }
        }
        .animate-shimmer-slow {
          animation: shimmer-slow 6s infinite ease-in-out;
        }
      `}</style>
    </>
  );
}