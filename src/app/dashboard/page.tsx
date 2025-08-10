"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import dynamic from "next/dynamic";
import Link from "next/link";

// Dynamic imports for charts with SSR disabled
const ChartContainer = dynamic(
  () => import("@/components/ChartContainer"),
  { 
    ssr: false,
    loading: () => <div className="h-64 flex items-center justify-center">Ładowanie wykresów...</div>
  }
);

export default function DashboardPage() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeData, setTimeData] = useState<any[]>([]);
  const [progressData, setProgressData] = useState<any>(null);
  const [flashcardsData, setFlashcardsData] = useState<any>(null);
  const [wordMatchData, setWordMatchData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Fetch all data in parallel
          const [
            { data: profile },
            { data: progress },
            { data: flashcards },
            { data: wordMatch }
          ] = await Promise.all([
            supabase.from("profiles").select("*").eq("id", user.id).single(),
            supabase.from("progress").select("*").eq("user_id", user.id).single(),
            supabase.from("flashcards_progress").select("*").eq("user_id", user.id),
            supabase.from("word_match_progress").select("*").eq("user_id", user.id)
          ]);

          // Prepare time data
          const { data: timeStats } = await supabase
            .from("progress")
            .select("time_spent, updated_at")
            .eq("user_id", user.id)
            .order("updated_at", { ascending: false })
            .limit(7);

          setUserData(profile);
          setProgressData(progress);
          setFlashcardsData(flashcards);
          setWordMatchData(wordMatch);
          setTimeData(
            timeStats?.map(item => ({
              date: new Date(item.updated_at).toLocaleDateString("pl-PL", { day: "numeric", month: "short" }),
              time: Math.round(item.time_spent / 60)
            })).reverse() || []
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-indigo-600 dark:text-indigo-400 text-xl">Ładowanie danych...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">Twój dashboard</h1>
          <nav className="flex gap-4">
            <Link href="/learn" className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800 transition">
              Kontynuuj naukę
            </Link>
            <Link href="/settings" className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition">
              Ustawienia
            </Link>
          </nav>
        </div>

        {/* User Profile Card */}
        {userData && (
          <div className="mb-8 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-2xl font-bold text-indigo-600 dark:text-indigo-300">
                {userData.first_name?.[0]}{userData.last_name?.[0]}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  {userData.first_name} {userData.last_name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{userData.email}</p>
                {progressData && (
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
                    Dołączyłeś {new Date(userData.created_at).toLocaleDateString("pl-PL")} • 
                    Całkowity czas nauki: {Math.round((progressData.time_spent || 0) / 60)} minut
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Overall Progress */}
          <StatCard 
            title="Ogólny postęp"
            icon={
              <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
          >
            {progressData ? (
              <div className="space-y-2">
                <StatItem label="Poprawne odpowiedzi" value={progressData.correct_answers} />
                <StatItem label="Łączne odpowiedzi" value={progressData.total_answers} />
                <StatItem 
                  label="Dokładność" 
                  value={`${progressData.total_answers > 0 
                    ? Math.round((progressData.correct_answers / progressData.total_answers) * 100) 
                    : 0}%`} 
                />
                <StatItem 
                  label="Czas nauki" 
                  value={`${Math.round((progressData.time_spent || 0) / 60)} minut`} 
                />
              </div>
            ) : (
              <p className="text-gray-500">Brak danych</p>
            )}
          </StatCard>

          {/* Flashcards Progress */}
          <StatCard 
            title="Fiszki"
            icon={
              <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          >
{flashcardsData?.length > 0 ? (
  <div className="space-y-3">
    {flashcardsData.map((item: any, index: number) => (
      <div 
        key={`flashcard-${index}-${item.level}-${item.direction}`} // Unikalny klucz
        className="border-b border-gray-100 dark:border-gray-800 pb-2 last:border-0"
      >
        <h4 className="font-medium text-gray-700 dark:text-gray-300">
          {item.level} ({item.direction})
        </h4>
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-500">
          <span>Pozostało: {item.remaining_ids?.length || 0}</span>
          <span>Poprawne: {item.correct_answers}/{item.total_answers}</span>
        </div>
      </div>
    ))}
  </div>
) : (
  <p className="text-gray-500">Brak danych o fiszkach</p>
)}
          </StatCard>

          {/* Word Match Progress */}
          <StatCard 
            title="Dopasowywanie słów"
            icon={
              <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
          >
{wordMatchData?.length > 0 ? (
  <div className="space-y-3">
    {wordMatchData.map((item: any, index: number) => (
      <div 
        key={`wordmatch-${index}-${item.difficulty}`} // Unikalny klucz
        className="border-b border-gray-100 dark:border-gray-800 pb-2 last:border-0"
      >
        <h4 className="font-medium text-gray-700 dark:text-gray-300">
          Poziom: {item.difficulty}
        </h4>
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-500 dark:text-gray-500">
          <span>Nauczone: {item.learned_ids?.length || 0}</span>
          <span>Wynik: {item.score}</span>
          <span>Błędy: {item.errors}</span>
          <span>Czas: {Math.round(item.time_spent / 60)} min</span>
        </div>
      </div>
    ))}
  </div>
) : (
  <p className="text-gray-500">Brak danych o dopasowywaniu</p>
)}
          </StatCard>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Time Spent Chart */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
            <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-4">
              Czas nauki w ostatnich dniach
            </h3>
            <div className="h-64">
              <ChartContainer data={timeData} type="time" />
            </div>
          </div>

          {/* Accuracy Chart */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
            <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-4">
              Dokładność odpowiedzi
            </h3>
            <div className="h-64">
              <ChartContainer 
                data={[
                  { name: 'Poprawne', value: progressData?.correct_answers || 0 },
                  { name: 'Błędne', value: (progressData?.total_answers || 0) - (progressData?.correct_answers || 0) }
                ]} 
                type="accuracy" 
              />
            </div>
          </div>
        </div>

        {/* Learned Words Section */}
{/* {progressData?.remaining_verbs && (
  <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
        Twoje postępy w nauce czasowników
      </h3>
      <span className="text-sm bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-3 py-1 rounded-full">
        {progressData.remaining_verbs.length} czasowników
      </span>
    </div>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {progressData.remaining_verbs.slice(0, 10).map((verb: any, index: number) => (
        <div 
          key={`verb-${index}-${verb.base}`}
          className="bg-indigo-50 dark:bg-indigo-950 p-4 rounded-lg"
        >
          <h4 className="font-bold text-indigo-800 dark:text-indigo-200 mb-2">
            {verb.base}
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Past:</div>
            <div className="font-medium">{verb.past}</div>
            <div>Participle:</div>
            <div className="font-medium">{verb.participle}</div>
            <div>Tłumaczenie:</div>
            <div className="font-medium">{verb.translation}</div>
          </div>
        </div>
      ))}
      {progressData.remaining_verbs.length > 10 && (
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg flex items-center justify-center text-gray-500">
          +{progressData.remaining_verbs.length - 10} więcej czasowników
        </div>
      )}
    </div>
  </div>
)} */}
      </div>
    </div>
  );
}

// Component for stat cards
function StatCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow h-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
      </div>
      {children}
    </div>
  );
}

// Component for stat items
function StatItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-600 dark:text-gray-400">{label}</span>
      <span className="font-medium text-gray-800 dark:text-gray-200">{value}</span>
    </div>
  );
}