"use client";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import dynamic from "next/dynamic";
import Link from "next/link";
import ChartContainer from "@/components/ui/Chart";
import StreakBadge from "@/components/streakBadge";

export default function DashboardPage() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeData, setTimeData] = useState<any[]>([]);
  const [tasksProgressData, setTasksProgressData] = useState<any>(null);
  const [irregularProgressData, setirregularProgressData] = useState<any>(null);
  const [flashcardsData, setFlashcardsData] = useState<any>(null);
  const [wordMatchData, setWordMatchData] = useState<any>(null);
  const [streakData, setStreakData] = useState<any>(null);
  const [combinedProgress, setCombinedProgress] = useState<any>(null);
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

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const [
            { data: profile },
            { data: tasksProgress },
            { data: irregular_progress },
            { data: flashcards },
            { data: wordMatch },
            { data: streakInfo }
          ] = await Promise.all([
            supabase.from("profiles").select("*").eq("id", user.id).single(),
            supabase.from("tasks_progress").select("*").eq("user_id", user.id).single(),
            supabase.from("irregular_progress").select("*").eq("user_id", user.id),
            supabase.from("flashcards_progress").select("*").eq("user_id", user.id),
            supabase.from("word_match_progress").select("*").eq("user_id", user.id),
            supabase.from("streaks").select("*").eq("user_id", user.id).single()
          ]);

          setUserData(profile);
          setTasksProgressData(tasksProgress);
          setirregularProgressData(irregular_progress);
          setFlashcardsData(flashcards);
          setWordMatchData(wordMatch);
          setStreakData(streakInfo);
          
          // Przygotowanie danych o czasie z różnych źródeł
          const allTimeData: any[] = [];
          
          // Pobieranie danych z firegular_progress
          if (irregular_progress) {
            irregular_progress.forEach((item: any) => {
              if (item.updated_at) {
                allTimeData.push({
                  date: new Date(item.updated_at),
                  time: Math.round(item.time_spent / 60),
                  source: 'irregular_progress'
                });
              }
            });
          }
          
          // Pobieranie danych z flashcards_progress
          if (flashcards) {
            flashcards.forEach((item: any) => {
              if (item.updated_at) {
                allTimeData.push({
                  date: new Date(item.updated_at),
                  time: Math.round((item.time_spend || 0) / 60),
                  source: 'Flashcards'
                });
              }
            });
          }
          
          // Pobieranie danych z word_match_progress
          if (wordMatch) {
            wordMatch.forEach((item: any) => {
              if (item.updated_at) {
                allTimeData.push({
                  date: new Date(item.updated_at),
                  time: Math.round(item.time_spent / 60),
                  source: 'Word Match'
                });
              }
            });
          }
          
          // Sortowanie danych po dacie
          allTimeData.sort((a, b) => b.date - a.date);
          
          // Grupowanie danych po dacie (bez godzin)
          const groupedByDate: {[key: string]: any} = {};
          allTimeData.forEach(item => {
            const dateKey = item.date.toDateString();
            if (!groupedByDate[dateKey]) {
              groupedByDate[dateKey] = {
                date: item.date,
                time: 0,
                activities: new Set()
              };
            }
            groupedByDate[dateKey].time += item.time;
            groupedByDate[dateKey].activities.add(item.source);
          });
          
          // Konwersja na tablicę
          const timeDataArray = Object.values(groupedByDate).map((item: any) => ({
            date: item.date.toLocaleDateString("pl-PL"),
            time: item.time,
            activities: Array.from(item.activities).join(', '),
            dateObj: item.date
          }));
          
          setTimeData(timeDataArray.slice(0, 30)); // Ostatnie 30 dni

          // Obliczanie streak
          if (streakInfo) {
            setStreak(streakInfo.current_streak || 0);
          } else if (timeDataArray.length > 0) {
            // Obliczanie streak na podstawie aktywności
            let currentStreak = 0;
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            // Sprawdź czy dzisiaj była aktywność
            const hasToday = timeDataArray.some((item: any) => 
              item.dateObj.toDateString() === today.toDateString()
            );
            
            if (hasToday) {
              currentStreak = 1;
              let checkDate = new Date(today);
              
              // Sprawdzaj kolejne poprzednie dni
              for (let i = 1; i < timeDataArray.length; i++) {
                checkDate.setDate(checkDate.getDate() - 1);
                const hasActivity = timeDataArray.some((item: any) => 
                  item.dateObj.toDateString() === checkDate.toDateString()
                );
                
                if (hasActivity) {
                  currentStreak++;
                } else {
                  break;
                }
              }
            }
            
            setStreak(currentStreak);
          }

          // Obliczanie łącznego postępu
          let combinedCorrect = 0;
          let combinedTotal = 0;
          let combinedTime = 0;
          let completedTasks = 0;
          let remainingVerbs = 0;

          // Tasks progress
          if (tasksProgress) {
            combinedCorrect += tasksProgress.correct_answers || 0;
            combinedTotal += tasksProgress.total_attempts || 0;
            // Liczenie ukończonych zadań
            if (tasksProgress.completed_tasks) {
              try {
                const completed = tasksProgress.completed_tasks;
                completedTasks = Array.isArray(completed) ? completed.length : 0;
              } catch (e) {
                console.error("Error parsing completed_tasks", e);
              }
            }
          }

          // Firegular progress
          if (irregular_progress && irregular_progress.length > 0) {
            irregular_progress.forEach((item: any) => {
              combinedCorrect += item.correct_answers || 0;
              combinedTotal += item.total_answers || 0;
              combinedTime += item.time_spent || 0;
              
              // Liczenie pozostałych czasowników
              if (item.remaining_verbs) {
                try {
                  const verbs = item.remaining_verbs;
                  remainingVerbs += Array.isArray(verbs) ? verbs.length : 0;
                } catch (e) {
                  console.error("Error parsing remaining_verbs", e);
                }
              }
            });
          }

          // Flashcards progress
          if (flashcards) {
            flashcards.forEach((item: any) => {
              combinedCorrect += item.correct_answers || 0;
              combinedTotal += item.total_answers || 0;
              combinedTime += item.time_spend || 0;
            });
          }

          // Word match progress
          if (wordMatch) {
            wordMatch.forEach((item: any) => {
              combinedCorrect += item.score || 0;
              combinedTotal += (item.score || 0) + (item.errors || 0);
              combinedTime += item.time_spent || 0;
            });
          }

          setCombinedProgress({
            correct_answers: combinedCorrect,
            total_answers: combinedTotal,
            time_spent: combinedTime,
            completed_tasks: completedTasks,
            remaining_verbs: remainingVerbs
          });
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

  const activityByDayFiltered = [
  { name: 'Niedziela', value: activityByDay[0] },
  { name: 'Poniedziałek', value: activityByDay[1] },
  { name: 'Wtorek', value: activityByDay[2] },
  { name: 'Środa', value: activityByDay[3] },
  { name: 'Czwartek', value: activityByDay[4] },
  { name: 'Piątek', value: activityByDay[5] },
  { name: 'Sobota', value: activityByDay[6] }
].filter(day => day.value > 0);

// Znajdź najbardziej produktywne dni (tylko te z aktywnością)
const mostProductiveDays = activityByDayFiltered
  .sort((a, b) => b.value - a.value)
  .slice(0, 2)
  .map(item => item.name)
  .join(' i ');
  // Przygotowanie danych do mapy aktywności (ostatnie 3 miesiące - 91 dni)
  const prepareActivityMapData = () => {
    const today = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setDate(today.getDate() - 90); // 91 dni włącznie z dzisiaj
    
    const activityMapData = [];
    
    // Tworzymy dane dla ostatnich 91 dni
    for (let i = 90; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dateKey = date.toDateString();
      const hasData = timeData.some((d: any) => 
        d.dateObj.toDateString() === dateKey
      );
      
      // Znajdź czas nauki dla tego dnia
      const dayData = timeData.find((d: any) => d.dateObj.toDateString() === dateKey);
      const timeSpent = dayData ? dayData.time : 0;
      
      // Określ poziom aktywności na podstawie czasu nauki
      let activityLevel = 0;
      if (timeSpent > 0) {
        if (timeSpent <= 15) activityLevel = 1;
        else if (timeSpent <= 30) activityLevel = 2;
        else activityLevel = 3;
      }
      
      activityMapData.push({
        date,
        timeSpent,
        activityLevel
      });
    }
    
    return activityMapData;
  };

  const activityMapData = prepareActivityMapData();

  return (
    <>
      <Navbar />
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
              <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition"
              >
                Wyloguj
              </button>
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
                  {combinedProgress && (
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
                      Dołączyłeś {new Date(userData.created_at).toLocaleDateString("pl-PL")} • 
                      Całkowity czas nauki: {Math.round((combinedProgress.time_spent || 0) / 60)} minut
                    </p>
                  )}
                </div>
                <StreakBadge />
                
                <div className="grid grid-cols-4 gap-4 text-center">
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
                  <div>
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      {combinedProgress?.completed_tasks || 0}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Ukończone zadania</p>
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
                    label="Ukończone zadania" 
                    value={combinedProgress.completed_tasks || 0} 
                  />
                </div>
              ) : (
                <p className="text-gray-500">Brak danych</p>
              )}
            </StatCard>

            {/* Firegular Progress */}
            <StatCard 
              title="Czasowniki nieregularne"
              icon={
                <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
            >
              {irregularProgressData?.length > 0 ? (
                <div className="space-y-3">
                  {irregularProgressData.map((item: any, index: number) => (
                    <div key={`irregular_progress-${index}`} className="border-b border-gray-100 dark:border-gray-800 pb-2 last:border-0">
                      <h4 className="font-medium text-gray-700 dark:text-gray-300">
                        Postęp czasowników
                      </h4>
                      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-500">
                        <span>Poprawne: {item.correct_answers}/{item.total_answers}</span>
                        <span>Pozostało: {item.remaining_verbs ? item.remaining_verbs.length : 0}</span>
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
                <p className="text-gray-500">Brak danych o czasownikach</p>
              )}
            </StatCard>

            {/* Tasks Progress */}
            <StatCard 
              title="Postęp zadań gramatycznych"
              icon={
                <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              }
            >
              {tasksProgressData ? (
                <div className="space-y-3">
                  <div className="border-b border-gray-100 dark:border-gray-800 pb-2">
                    <h4 className="font-medium text-gray-700 dark:text-gray-300">
                      Ogólny postęp zadań
                    </h4>
                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-500">
                      <span>Poprawne: {tasksProgressData.correct_answers}/40</span>
                      <span>Ukończone: {combinedProgress?.completed_tasks || 0}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-1.5 mt-1">
                      <div 
                        className="bg-indigo-600 h-1.5 rounded-full" 
                        style={{ 
                          width: `${tasksProgressData.total_attempts > 0 ? Math.round((tasksProgressData.correct_answers / 40) * 100) : 0}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Brak danych o zadaniach</p>
              )}
            </StatCard>

            {/* Recent Activity */}
   </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Heatmap Activity Calendar */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
              <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-4">
                Twoja mapa aktywności (ostatnie 3 miesiące)
              </h3>
              
              <div className="overflow-x-auto">
                <div className="inline-block min-w-full">
                  {/* Calendar - ostatnie 91 dni (3 miesiące) */}
                  <div className="grid grid-flow-col grid-rows-7 gap-1">
                    {activityMapData.map((item, dayIndex) => {
                      const colors = [
                        'bg-gray-100 dark:bg-gray-800',
                        'bg-indigo-200 dark:bg-indigo-900',
                        'bg-indigo-400 dark:bg-indigo-700',
                        'bg-indigo-600 dark:bg-indigo-500'
                      ];
                      
                      return (
                        <div 
                          key={dayIndex}
                          className={`w-3 h-3 rounded-sm ${colors[item.activityLevel]} 
                            hover:scale-125 transition-transform cursor-pointer`}
                          title={`${item.date.toLocaleDateString('pl-PL')}: ${item.timeSpent > 0 ? `${item.timeSpent} minut nauki` : 'Brak aktywności'}`}
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
  {activityByDayFiltered.length > 0 ? (
    <>
      <div className="h-64">
        <ChartContainer 
          data={activityByDayFiltered} 
          type="bar" 
        />
      </div>
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        <p>Twoje najbardziej produktywne dni to: {mostProductiveDays}</p>
      </div>
    </>
  ) : (
    <div className="h-64 flex items-center justify-center">
      <p className="text-gray-500 dark:text-gray-400 text-center">
        Brak danych o aktywności w ciągu tygodnia
      </p>
    </div>
  )}
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

          {/* Additional Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Flashcards Progress */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
              <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Postęp fiszek
              </h3>
              {flashcardsData?.length > 0 ? (
                <div className="space-y-4">
                  {flashcardsData.map((item: any, index: number) => (
                    <div 
                      key={`flashcard-${index}-${item.level}-${item.direction}`}
                      className="border-b border-gray-100 dark:border-gray-800 pb-3 last:border-0"
                    >
                      <h4 className="font-medium text-gray-700 dark:text-gray-300">
                        {item.level} ({item.direction})
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-500 dark:text-gray-500 mt-1">
                        <span>Pozostało: {item.remaining_ids?.length || 0}</span>
                        <span>Poprawne: {item.correct_answers}/{item.total_answers}</span>
                        <span>Dokładność: {item.total_answers > 0 ? Math.round((item.correct_answers / item.total_answers) * 100) : 0}%</span>
                        <span>Czas: {Math.round((item.time_spend || 0) / 60)} min</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 mt-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full" 
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
            </div>

            {/* Word Match Progress */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
              <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Dopasowywanie słów
              </h3>
              {wordMatchData?.length > 0 ? (
                <div className="space-y-4">
                  {wordMatchData.map((item: any, index: number) => (
                    <div 
                      key={`wordmatch-${index}-${item.difficulty}`}
                      className="border-b border-gray-100 dark:border-gray-800 pb-3 last:border-0"
                    >
                      <h4 className="font-medium text-gray-700 dark:text-gray-300">
                        Poziom: {item.difficulty}
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-500 dark:text-gray-500 mt-1">
                        <span>Nauczone: {item.learned_ids?.length || 0}</span>
                        <span>Wynik: {item.score}</span>
                        <span>Błędy: {item.errors}</span>
                        <span>Czas: {Math.round(item.time_spent / 60)} min</span>
                        <span>Dokładność: {(item.score + item.errors) > 0 ? Math.round((item.score / (item.score + item.errors)) * 100) : 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 mt-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full" 
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
            </div>
          </div>
        </div>
      </div>
    </>
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