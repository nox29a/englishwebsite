"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import dynamic from "next/dynamic";
import Link from "next/link";
import ChartContainer from "@/components/ui/Chart";

export default function DashboardPage() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeData, setTimeData] = useState<any[]>([]);
  const [progressData, setProgressData] = useState<any>(null);
  const [flashcardsData, setFlashcardsData] = useState<any>(null);
  const [wordMatchData, setWordMatchData] = useState<any>(null);
  const [combinedProgress, setCombinedProgress] = useState<any>(null);
  const [userAnswers, setUserAnswers] = useState<any[]>([]);
  const [streak, setStreak] = useState(0);
  

type ChartType = 'pie' | 'bar' | 'line' | 'accuracy';

interface ChartData {
  name: string;
  value: number;
}

interface ChartProps {
  data: ChartData[];
  type: ChartType;
}

const ChartContainer = dynamic(
  () => import("@/components/ui/Chart"),
  { ssr: false }
) as React.FC<ChartProps>;

interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
}

interface ProgressData {
  user_id: string;
  correct_answers: number;
  total_answers: number;
  time_spent: number;
  updated_at: string;
}
interface TimeStat {
  time_spent: number;
  updated_at: string;
  // Dodaj inne pola które zwraca Supabase
}

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
            { data: wordMatch },
            { data: answers },
            { data: timeStats }
          ] = await Promise.all([
            supabase.from("profiles").select("*").eq("id", user.id).single(),
            supabase.from("progress").select("*").eq("user_id", user.id).single(),
            supabase.from("flashcards_progress").select("*").eq("user_id", user.id),
            supabase.from("word_match_progress").select("*").eq("user_id", user.id),
            supabase.from("user_answers").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(10),
            supabase.from("progress").select("time_spent, updated_at").eq("user_id", user.id).order("updated_at", { ascending: false }).limit(30)
          ]);

          setUserData(profile);
          setProgressData(progress);
          setFlashcardsData(flashcards);
          setWordMatchData(wordMatch);
          setUserAnswers(answers || []);
          
          // Prepare time data
          setTimeData(
            timeStats?.map(item => ({
              date: new Date(item.updated_at).toLocaleDateString("pl-PL"),
              time: Math.round(item.time_spent / 60),
              dateObj: new Date(item.updated_at)
            })).reverse() || []
          );

          // Calculate streak
if (timeStats && timeStats.length > 0) {
    let currentStreak = 0;
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // TypeScript teraz wie, że timeStats istnieje
    const hasToday = timeStats.some((item) => 
      new Date(item.updated_at).toDateString() === today.toDateString()
    );
    const hasYesterday = timeStats.some((item) => 
      new Date(item.updated_at).toDateString() === yesterday.toDateString()
    );
    
    if (hasToday || hasYesterday) {
      currentStreak = 1;
      for (let i = 1; i < timeStats.length; i++) {
        const prevDate = new Date(timeStats[i-1].updated_at);
        const currDate = new Date(timeStats[i].updated_at);
        const diffDays = Math.round((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          currentStreak++;
        } else if (diffDays > 1) {
          break;
        }
      }
    }
    setStreak(currentStreak);
}

          // Calculate combined progress
          if (progress || flashcards || wordMatch) {
            const combined = {
              correct_answers: (progress?.correct_answers || 0) + 
                            (flashcards?.reduce((sum: number, item: any) => sum + (item.correct_answers || 0), 0) || 0) +
                            (wordMatch?.reduce((sum: number, item: any) => sum + (item.score || 0), 0) || 0),
              total_answers: (progress?.total_answers || 0) + 
                          (flashcards?.reduce((sum: number, item: any) => sum + (item.total_answers || 0), 0) || 0) +
                          (wordMatch?.reduce((sum: number, item: any) => sum + (item.score || 0) + (item.errors || 0), 0) || 0),
              time_spent: (progress?.time_spent || 0) +
                         (flashcards?.reduce((sum: number, item: any) => sum + (item.time_spent || 0), 0) || 0) +
                         (wordMatch?.reduce((sum: number, item: any) => sum + (item.time_spent || 0), 0) || 0)
            };
            setCombinedProgress(combined);
          }
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

  // Calculate activity distribution by day of week
  const activityByDay = [0, 0, 0, 0, 0, 0, 0]; // 0=Sunday, 1=Monday, etc.
  timeData.forEach(item => {
    const day = item.dateObj.getDay();
    activityByDay[day] += item.time;
  });

  // Calculate most active time of day
  const timeOfDayStats = {
    morning: 0,
    afternoon: 0,
    evening: 0,
    night: 0
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with streak */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">Twój dashboard</h1>
            {streak > 0 && (
              <div className="flex items-center mt-2">
                <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-3 py-1 rounded-full text-sm font-medium">
                  🔥 Streak: {streak} dni
                </span>
              </div>
            )}
          </div>
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
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  {userData.first_name} {userData.last_name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{userData.email}</p>
                {progressData && (
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
                    Dołączyłeś {new Date(userData.created_at).toLocaleDateString("pl-PL")} • 
                    Całkowity czas nauki: {Math.round((combinedProgress?.time_spent || 0) / 60)} minut
                  </p>
                )}
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    {combinedProgress?.correct_answers || 0}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Poprawne</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    {combinedProgress?.total_answers || 0}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Odpowiedzi</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    {combinedProgress?.total_answers > 0 
                      ? Math.round((combinedProgress.correct_answers / combinedProgress.total_answers) * 100) 
                      : 0}%
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Skuteczność</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Overall Progress */}
          <StatCard 
            title="Ogólny postęp"
            icon={
              <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
          >
            {combinedProgress ? (
              <div className="space-y-2">
                <StatItem label="Poprawne odpowiedzi" value={combinedProgress.correct_answers} />
                <StatItem label="Łączne odpowiedzi" value={combinedProgress.total_answers} />
                <StatItem 
                  label="Dokładność" 
                  value={`${combinedProgress.total_answers > 0 
                    ? Math.round((combinedProgress.correct_answers / combinedProgress.total_answers) * 100) 
                    : 0}%`} 
                />
                <StatItem 
                  label="Czas nauki" 
                  value={`${Math.round((combinedProgress.time_spent || 0) / 60)} minut`} 
                />
                <StatItem 
                  label="Średnio na dzień" 
                  value={`${Math.round((combinedProgress.time_spent || 0) / Math.max(timeData.length, 1) / 60)} minut`} 
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
                    key={`flashcard-${index}-${item.level}-${item.direction}`}
                    className="border-b border-gray-100 dark:border-gray-800 pb-2 last:border-0"
                  >
                    <h4 className="font-medium text-gray-700 dark:text-gray-300">
                      {item.level} ({item.direction})
                    </h4>
                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-500">
                      <span>Pozostało: {item.remaining_ids?.length || 0}</span>
                      <span>Poprawne: {item.correct_answers}/{item.total_answers}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-1.5 mt-1">
                      <div 
                        className="bg-indigo-600 h-1.5 rounded-full" 
                        style={{ 
                          width: `${item.total_answers > 0 ? Math.round((item.correct_answers / item.total_answers) * 100) : 0}%` 
                        }}
                      />
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
                    key={`wordmatch-${index}-${item.difficulty}`}
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
                    <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-1.5 mt-1">
                      <div 
                        className="bg-indigo-600 h-1.5 rounded-full" 
                        style={{ 
                          width: `${(item.score + item.errors) > 0 ? Math.round((item.score / (item.score + item.errors)) * 100) : 0}%` 
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Brak danych o dopasowywaniu</p>
            )}
          </StatCard>

          {/* Recent Activity */}
          <StatCard 
            title="Ostatnia aktywność"
            icon={
              <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          >
            {timeData?.length > 0 ? (
              <div className="space-y-3">
                {timeData.slice(-3).reverse().map((item: any, index: number) => (
                  <div key={`activity-${index}`} className="border-b border-gray-100 dark:border-gray-800 pb-2 last:border-0">
                    <h4 className="font-medium text-gray-700 dark:text-gray-300">
                      {item.date}
                    </h4>
                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-500">
                      <span>Czas nauki</span>
                      <span>{item.time} minut</span>
                    </div>
                  </div>
                ))}
                {userAnswers?.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Ostatnie odpowiedzi</h4>
                    {userAnswers.slice(0, 2).map((answer: any, index: number) => (
                      <div key={`answer-${index}`} className="text-sm mb-2">
                        <p className="truncate text-gray-600 dark:text-gray-400">{answer.question}</p>
                        <p className={`text-sm ${answer.is_correct ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {answer.is_correct ? '✔' : '✖'} {answer.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500">Brak ostatniej aktywności</p>
            )}
          </StatCard>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Heatmap Activity Calendar */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
            <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-4">
              Twoja mapa aktywności
            </h3>
            
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full">
                {/* Calendar */}
                <div className="grid grid-flow-col grid-rows-7 gap-1">
                  {Array.from({ length: 364 }).map((_, dayIndex) => {
                    const date = new Date();
                    date.setDate(date.getDate() - 364 + dayIndex);
                    const dateKey = date.toISOString().split('T')[0];
                    
                    const hasData = timeData.some((d: any) => 
                      new Date(d.date).toDateString() === date.toDateString()
                    );
                    const activityLevel = hasData ? 2 : 0;
                    
                    const colors = [
                      'bg-gray-100 dark:bg-gray-800',
                      'bg-indigo-200 dark:bg-indigo-900',
                      'bg-indigo-400 dark:bg-indigo-700',
                      'bg-indigo-600 dark:bg-indigo-500'
                    ];
                    
                    return (
                      <div 
                        key={dayIndex}
                        className={`w-3 h-3 rounded-sm ${colors[activityLevel]} 
                          hover:scale-125 transition-transform cursor-pointer`}
                        title={`${date.toLocaleDateString('pl-PL')}: ${hasData ? 'Aktywny' : 'Brak danych'}`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Legend */}
            <div className="flex items-center justify-end mt-4 space-x-4">
              <div className="flex items-center">
                <span className="text-xs mr-2 text-gray-500 dark:text-gray-400">Mniej</span>
                {[0, 1, 2, 3].map((level) => (
                  <div 
                    key={level}
                    className={`w-3 h-3 rounded-sm ${[
                      'bg-gray-100 dark:bg-gray-800',
                      'bg-indigo-200 dark:bg-indigo-900',
                      'bg-indigo-400 dark:bg-indigo-700',
                      'bg-indigo-600 dark:bg-indigo-500'
                    ][level]}`}
                  />
                ))}
                <span className="text-xs ml-2 text-gray-500 dark:text-gray-400">Więcej</span>
              </div>
            </div>
            
            {/* Summary stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {timeData.length}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Dni z nauką</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {Math.max(...timeData.map((d: any) => d.time), 0)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Rekord minut</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {timeData.reduce((sum: number, day: any) => sum + day.time, 0)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Łącznie minut</p>
              </div>
            </div>
          </div>

          {/* Activity by Day of Week */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
            <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-4">
              Aktywność w ciągu tygodnia
            </h3>
            <div className="h-64">
              <ChartContainer 
                data={[
                  { name: 'Niedziela', value: activityByDay[0] },
                  { name: 'Poniedziałek', value: activityByDay[1] },
                  { name: 'Wtorek', value: activityByDay[2] },
                  { name: 'Środa', value: activityByDay[3] },
                  { name: 'Czwartek', value: activityByDay[4] },
                  { name: 'Piątek', value: activityByDay[5] },
                  { name: 'Sobota', value: activityByDay[6] }
                ]} 
                type="bar" 
              />
            </div>
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              <p>Twoje najbardziej produktywne dni to: {
                activityByDay.map((val, idx) => ({val, idx}))
                  .sort((a, b) => b.val - a.val)
                  .slice(0, 2)
                  .map(item => ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'][item.idx])
                  .join(' i ')
              }</p>
            </div>
          </div>
        </div>

        {/* Additional Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Accuracy Chart */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
            <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-4">
              Dokładność odpowiedzi
            </h3>
            <div className="h-64">
              <ChartContainer 
                data={[
                  { name: 'Poprawne', value: combinedProgress?.correct_answers || 0 },
                  { name: 'Błędne', value: (combinedProgress?.total_answers || 0) - (combinedProgress?.correct_answers || 0) }
                ]} 
                type="pie" 
              />
            </div>
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              {combinedProgress?.total_answers > 0 && (
                <p>Twoja dokładność to {Math.round((combinedProgress.correct_answers / combinedProgress.total_answers) * 100)}%</p>
              )}
            </div>
          </div>

          {/* Time Spent Trend */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
            <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-4">
              Trend czasu nauki (ostatnie 30 dni)
            </h3>
            <div className="h-64">
              <ChartContainer 
                data={timeData.map((item: any) => ({
                  name: item.date,
                  value: item.time
                }))} 
                type="line" 
              />
            </div>
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              {timeData.length > 0 && (
                <p>Średnio {Math.round(timeData.reduce((sum: number, day: any) => sum + day.time, 0) / timeData.length)} minut dziennie</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Answers Section */}
        {userAnswers?.length > 0 && (
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow mb-8">
            <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-4">
              Ostatnie odpowiedzi
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pytanie</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Twoja odpowiedź</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Poprawna odpowiedź</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Wynik</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                  {userAnswers.slice(0, 5).map((answer: any, index: number) => (
                    <tr key={`answer-row-${index}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 max-w-xs truncate">{answer.question}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{answer.answer}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{answer.correct_answer}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          answer.is_correct 
                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                            : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                        }`}>
                          {answer.is_correct ? 'Poprawnie' : 'Błędnie'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
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