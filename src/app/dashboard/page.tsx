"use client";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { isAuthSessionMissingError } from "@/lib/authErrorUtils";
import dynamic from "next/dynamic";
import Link from "next/link";
import ChartContainer from "@/components/ui/Chart";
import { 
  Trophy, 
  Target, 
  Zap, 
  BookOpen, 
  Clock, 
  TrendingUp, 
  Award, 
  Flame,
  Star,
  Brain,
  Sparkles,
  BarChart3,
  Calendar,
  CheckCircle
} from "lucide-react";

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
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) {
          if (!isAuthSessionMissingError(error)) {
            console.error('Błąd pobierania danych użytkownika:', error);
          }
          return;
        }

        if (user) {
          const [
            { data: profile },
            { data: attempts },
            { data: sessions },
            { data: dailyMetrics },
            { data: streakInfo }
          ] = await Promise.all([
            supabase.from("profiles").select("*").eq("id", user.id).single(),
            supabase
              .from("exercise_attempts")
              .select("id, skill_tags, correct_answers, incorrect_answers, total_questions, started_at, completed_at, score, metadata")
              .eq("user_id", user.id)
              .order("completed_at", { ascending: false })
              .limit(200),
            supabase
              .from("exercise_sessions")
              .select("started_at, ended_at, duration_seconds, source")
              .eq("user_id", user.id)
              .order("started_at", { ascending: false })
              .limit(200),
            supabase
              .from("daily_metrics")
              .select("metrics_date, total_time_seconds, total_attempts, total_sessions, correct_answers, incorrect_answers")
              .eq("user_id", user.id)
              .order("metrics_date", { ascending: false })
              .limit(90),
            supabase.from("streaks").select("*").eq("user_id", user.id).maybeSingle()
          ]);

          setUserData(profile);

          const sessionTime = (sessions ?? []).reduce((acc, session) => acc + (session.duration_seconds ?? 0), 0);

          const aggregate = (attempts ?? []).reduce(
            (acc, attempt) => {
              const total = attempt.total_questions ?? 0;
              const correct = attempt.correct_answers ?? 0;
              const incorrect = attempt.incorrect_answers ?? 0;
              const duration = attempt.completed_at && attempt.started_at
                ? Math.max(0, (new Date(attempt.completed_at).getTime() - new Date(attempt.started_at).getTime()) / 1000)
                : 0;

              return {
                correct: acc.correct + correct,
                total: acc.total + total,
                incorrect: acc.incorrect + incorrect,
                time: acc.time + duration,
                completed: acc.completed + ((attempt.score ?? 0) >= 80 ? 1 : 0),
                remainingVerbs: acc.remainingVerbs + ((attempt.metadata as any)?.remaining_verbs?.length ?? 0),
              };
            },
            { correct: 0, total: 0, incorrect: 0, time: 0, completed: 0, remainingVerbs: 0 }
          );

          setCombinedProgress({
            correct_answers: aggregate.correct,
            total_answers: aggregate.total,
            total_attempts: aggregate.total,
            time_spent: sessionTime || aggregate.time,
            completed_tasks: aggregate.completed,
            remaining_verbs: aggregate.remainingVerbs,
          });

          setTasksProgressData({
            correct_answers: aggregate.correct,
            total_attempts: aggregate.total,
            incorrect_answers: aggregate.incorrect,
          });

          const irregularAttempts = (attempts ?? []).filter((attempt) => attempt.skill_tags?.includes("irregular_verbs"));
          setirregularProgressData(
            irregularAttempts.map((attempt) => ({
              correct_answers: attempt.correct_answers ?? 0,
              total_answers: attempt.total_questions ?? 0,
              time_spent:
                attempt.completed_at && attempt.started_at
                  ? Math.max(0, (new Date(attempt.completed_at).getTime() - new Date(attempt.started_at).getTime()) / 1000)
                  : 0,
              remaining_verbs: (attempt.metadata as any)?.remaining_verbs ?? [],
            }))
          );

          const flashcardAttempts = (attempts ?? []).filter((attempt) => attempt.skill_tags?.includes("flashcards"));
          setFlashcardsData(
            flashcardAttempts.map((attempt) => ({
              level: (attempt.metadata as any)?.level ?? "Ogólny",
              direction: (attempt.metadata as any)?.direction ?? "dwustronne",
              remaining_ids: (attempt.metadata as any)?.remaining_ids ?? [],
              correct_answers: attempt.correct_answers ?? 0,
              total_answers: attempt.total_questions ?? 0,
              time_spend:
                (attempt.metadata as any)?.time_spent ??
                (attempt.completed_at && attempt.started_at
                  ? Math.max(0, (new Date(attempt.completed_at).getTime() - new Date(attempt.started_at).getTime()) / 1000)
                  : 0),
            }))
          );

          const wordMatchAttempts = (attempts ?? []).filter((attempt) => attempt.skill_tags?.includes("word_match"));
          setWordMatchData(
            wordMatchAttempts.map((attempt) => ({
              difficulty: (attempt.metadata as any)?.difficulty ?? "Standard",
              learned_ids: (attempt.metadata as any)?.learned_ids ?? [],
              score: (attempt.metadata as any)?.score ?? attempt.correct_answers ?? 0,
              errors: (attempt.metadata as any)?.errors ?? attempt.incorrect_answers ?? 0,
              time_spent:
                (attempt.metadata as any)?.time_spent ??
                (attempt.completed_at && attempt.started_at
                  ? Math.max(0, (new Date(attempt.completed_at).getTime() - new Date(attempt.started_at).getTime()) / 1000)
                  : 0),
            }))
          );

          setStreakData(streakInfo);

          const timeDataArray = (dailyMetrics ?? [])
            .map((metric) => {
              const dateObj = new Date(metric.metrics_date);
              return {
                date: dateObj.toLocaleDateString("pl-PL"),
                time: Math.round((metric.total_time_seconds ?? 0) / 60),
                activities: `Sesje: ${metric.total_sessions ?? 0}`,
                dateObj,
              };
            })
            .sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());

          setTimeData(timeDataArray.slice(0, 30));

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
        } else {
          return;
        }
      } catch (error) {
        if (!isAuthSessionMissingError(error)) {
          console.error("Error fetching data:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--cards-gradient-from)] via-[var(--cards-gradient-via)] to-[var(--cards-gradient-to)] flex items-center justify-center relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse"></div>
        
        {/* Loading Card */}
        <div className="bg-[var(--overlay-light)] backdrop-blur-lg rounded-xl shadow-2xl border border-[color:var(--border-translucent-strong)] p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mb-4 shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
          </div>
          <h2 className="text-2xl font-bold text-[var(--foreground)]">Ładowanie danych...</h2>
          <p className="text-gray-300 mt-2">Przygotowujemy Twój dashboard</p>
        </div>
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

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[var(--cards-gradient-from)] via-[var(--cards-gradient-via)] to-[var(--cards-gradient-to)] p-4 md:p-8 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse"></div>
        
        {/* Floating Particles */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-purple-400/30 rounded-full animate-bounce"></div>
        <div className="absolute top-40 right-20 w-6 h-6 bg-blue-400/30 rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 left-20 w-3 h-3 bg-pink-400/30 rounded-full animate-ping"></div>
        <div className="absolute bottom-20 right-10 w-5 h-5 bg-indigo-400/30 rounded-full animate-bounce"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header with streak */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-2">Twój Dashboard</h1>
              <p className="text-gray-300 text-lg">Śledź swój postęp w nauce</p>
              {streak > 0 && (
                <div className="inline-flex items-center bg-orange-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-orange-500/30 mt-3">
                  <Flame className="w-5 h-5 text-orange-300 mr-2" />
                  <span className="text-orange-300 font-bold">Streak: {streak} dni</span>
                </div>
              )}
            </div>
            
            <nav className="flex gap-3">
              <Link 
                href="/" 
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-[var(--foreground)] font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <BookOpen className="w-5 h-5 inline mr-2" />
                Kontynuuj naukę
              </Link>
              <Link 
                href="/settings" 
                className="px-6 py-3 bg-[var(--overlay-light)] backdrop-blur-sm hover:bg-[var(--overlay-light-strong)] text-[var(--foreground)] rounded-xl transition-all duration-300 border border-[color:var(--border-translucent-strong)] transform hover:scale-105"
              >
                Ustawienia
              </Link>
              <button 
                onClick={handleLogout}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-[var(--foreground)] font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Wyloguj
              </button>
            </nav>
          </div>

          {/* User Profile Card */}
          {userData && (
            <div className="mb-8 bg-[var(--overlay-light)] backdrop-blur-lg rounded-xl shadow-2xl border border-[color:var(--border-translucent-strong)] p-8 transition-all duration-300 transform hover:scale-[1.02] hover:bg-[var(--overlay-light-soft)]">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-[var(--foreground)] shadow-lg">
                    {userData.first_name?.[0]}{userData.last_name?.[0]}
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-[var(--foreground)]" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-[var(--foreground)] mb-1">
                    {userData.first_name} {userData.last_name}
                  </h2>
                  <p className="text-gray-300 text-lg">{userData.email}</p>
                  {combinedProgress && (
                    <p className="mt-2 text-gray-400">
                      Dołączyłeś {new Date(userData.created_at).toLocaleDateString("pl-PL")} • 
                      Całkowity czas nauki: {Math.round((combinedProgress.time_spent || 0) / 60)} minut
                    </p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatMiniCard 
                    icon={<Target className="w-5 h-5 text-green-400" />}
                    value={combinedProgress?.correct_answers || 0}
                    label="Poprawne"
                    bgColor="bg-gradient-to-br from-green-400/20 to-green-600/20 border border-green-500/30"
                  />
                  <StatMiniCard 
                    icon={<BarChart3 className="w-5 h-5 text-blue-400" />}
                    value={combinedProgress?.total_answers || 0}
                    label="Odpowiedzi"
                    bgColor="bg-gradient-to-br from-blue-400/20 to-blue-600/20 border border-blue-500/30"
                  />
                  <StatMiniCard 
                    icon={<TrendingUp className="w-5 h-5 text-purple-400" />}
                    value={`${combinedProgress?.total_answers > 0 
                      ? Math.round((combinedProgress.correct_answers / combinedProgress.total_answers) * 100) 
                      : 0}%`}
                    label="Skuteczność"
                    bgColor="bg-gradient-to-br from-purple-400/20 to-purple-600/20 border border-purple-500/30"
                  />
                  <StatMiniCard 
                    icon={<CheckCircle className="w-5 h-5 text-amber-400" />}
                    value={combinedProgress?.completed_tasks || 0}
                    label="Ukończone"
                    bgColor="bg-gradient-to-br from-amber-400/20 to-amber-600/20 border border-amber-500/30"
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Overall Progress */}
            <StatCard 
              title="Ogólny Postęp"
              icon={<Trophy className="w-6 h-6 text-purple-400" />}
              bgColor="bg-gradient-to-br from-purple-400/20 to-purple-600/20 border border-purple-500/30"
            >
              {combinedProgress ? (
                <div className="space-y-3">
                  <ProgressItem 
                    label="Poprawne odpowiedzi" 
                    value={combinedProgress.correct_answers}
                    color="text-green-400"
                  />
                  <ProgressItem 
                    label="Łączne odpowiedzi" 
                    value={combinedProgress.total_answers}
                    color="text-blue-400"
                  />
                  <ProgressItem 
                    label="Dokładność" 
                    value={`${combinedProgress.total_answers > 0 
                      ? Math.round((combinedProgress.correct_answers / combinedProgress.total_answers) * 100) 
                      : 0}%`}
                    color="text-purple-400"
                  />
                  <ProgressItem 
                    label="Czas nauki" 
                    value={`${Math.round((combinedProgress.time_spent || 0) / 60)} minut`}
                    color="text-amber-400"
                  />
                  <ProgressItem 
                    label="Ukończone zadania" 
                    value={combinedProgress.completed_tasks || 0}
                    color="text-emerald-400"
                  />
                </div>
              ) : (
                <p className="text-gray-400">Brak danych</p>
              )}
            </StatCard>

            {/* Irregular Verbs Progress */}
            <StatCard 
              title="Czasowniki Nieregularne"
              icon={<Zap className="w-6 h-6 text-yellow-400" />}
              bgColor="bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 border border-yellow-500/30"
            >
              {irregularProgressData?.length > 0 ? (
                <div className="space-y-4">
                  {irregularProgressData.map((item: any, index: number) => (
                    <div key={`irregular_progress-${index}`} className="bg-[var(--overlay-dark)] backdrop-blur-sm rounded-xl p-4 border border-[color:var(--border-translucent)]">
                      <h4 className="font-bold text-[var(--foreground)] mb-2">
                        Postęp czasowników
                      </h4>
                      <div className="flex justify-between text-sm text-gray-300 mb-2">
                        <span>Poprawne: {item.correct_answers}/{item.total_answers}</span>
                        <span>Pozostało: {item.remaining_verbs ? item.remaining_verbs.length : 0}</span>
                      </div>
                      <div className="bg-gray-800/50 backdrop-blur-sm rounded-full h-3 overflow-hidden border border-[color:var(--border-translucent)]">
                        <div 
                          className="bg-gradient-to-r from-[var(--progress-gradient-from)] via-[var(--progress-gradient-via)] to-[var(--progress-gradient-to)] h-3 rounded-full transition-all duration-1000 ease-out relative"
                          style={{ 
                            width: `${item.total_answers > 0 ? Math.round((item.correct_answers / item.total_answers) * 100) : 0}%` 
                          }}
                        >
                          <div className="absolute inset-0 bg-[var(--overlay-light-strong)] animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">Brak danych o czasownikach</p>
              )}
            </StatCard>

            {/* Grammar Tasks Progress */}
            <StatCard 
              title="Zadania Gramatyczne"
              icon={<BookOpen className="w-6 h-6 text-green-400" />}
              bgColor="bg-gradient-to-br from-green-400/20 to-green-600/20 border border-green-500/30"
            >
              {tasksProgressData ? (
                <div className="space-y-4">
                  <div className="bg-[var(--overlay-dark)] backdrop-blur-sm rounded-xl p-4 border border-[color:var(--border-translucent)]">
                    <h4 className="font-bold text-[var(--foreground)] mb-2">
                      Ogólny postęp zadań
                    </h4>
                    <div className="flex justify-between text-sm text-gray-300 mb-2">
                      <span>Poprawne: {tasksProgressData.correct_answers}/320</span>
                      <span>Ukończone: {combinedProgress?.completed_tasks || 0}</span>
                    </div>
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-full h-3 overflow-hidden border border-[color:var(--border-translucent)]">
                      <div 
                        className="bg-gradient-to-r from-[var(--progress-gradient-from)] via-[var(--progress-gradient-via)] to-[var(--progress-gradient-to)] h-3 rounded-full transition-all duration-1000 ease-out relative"
                        style={{ 
                          width: `${tasksProgressData.total_attempts > 0 ? Math.round((tasksProgressData.correct_answers / 320) * 100) : 0}%` 
                        }}
                      >
                        <div className="absolute inset-0 bg-[var(--overlay-light-strong)] animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400">Brak danych o zadaniach</p>
              )}
            </StatCard>

            {/* Time Stats */}
            <StatCard 
              title="Statystyki Czasu"
              icon={<Clock className="w-6 h-6 text-blue-400" />}
              bgColor="bg-gradient-to-br from-blue-400/20 to-blue-600/20 border border-blue-500/30"
            >
              <div className="space-y-3">
                <ProgressItem 
                  label="Czas dzisiaj" 
                  value={`${timeData.length > 0 && timeData[0].dateObj.toDateString() === new Date().toDateString() ? timeData[0].time : 0} min`}
                  color="text-blue-400"
                />
                <ProgressItem 
                  label="Średnio dziennie" 
                  value={`${timeData.length > 0 ? Math.round(timeData.reduce((sum, item) => sum + item.time, 0) / timeData.length) : 0} min`}
                  color="text-purple-400"
                />
                <ProgressItem 
                  label="Dni aktywnych" 
                  value={timeData.length}
                  color="text-green-400"
                />
                <ProgressItem 
                  label="Łączny czas" 
                  value={`${Math.round((combinedProgress?.time_spent || 0) / 60)} min`}
                  color="text-amber-400"
                />
              </div>
            </StatCard>
          </div>

          {/* Detailed Progress Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Flashcards Progress */}
            <DetailedStatCard 
              title="Postęp Fiszek"
              icon={<Brain className="w-5 h-5 text-indigo-400" />}
            >
              {flashcardsData?.length > 0 ? (
                <div className="space-y-4">
                  {flashcardsData.map((item: any, index: number) => (
                    <div 
                      key={`flashcard-${index}-${item.level}-${item.direction}`}
                      className="bg-[var(--overlay-dark)] backdrop-blur-sm rounded-xl p-4 border border-[color:var(--border-translucent)] transition-all duration-300 hover:bg-black/30"
                    >
                      <h4 className="font-bold text-[var(--foreground)] mb-2">
                        {item.level} ({item.direction})
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-300 mb-3">
                        <span>Pozostało: {item.remaining_ids?.length || 0}</span>
                        <span>Poprawne: {item.correct_answers}/{item.total_answers}</span>
                        <span>Dokładność: {item.total_answers > 0 ? Math.round((item.correct_answers / item.total_answers) * 100) : 0}%</span>
                        <span>Czas: {Math.round((item.time_spend || 0) / 60)} min</span>
                      </div>
                      <div className="bg-gray-800/50 backdrop-blur-sm rounded-full h-2 overflow-hidden border border-[color:var(--border-translucent)]">
                        <div 
                          className="bg-gradient-to-r from-[var(--progress-gradient-from)] via-[var(--progress-gradient-via)] to-[var(--progress-gradient-to)] h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{ 
                            width: `${item.total_answers > 0 ? Math.round((item.correct_answers / item.total_answers) * 100) : 0}%` 
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">Brak danych o fiszkach</p>
              )}
            </DetailedStatCard>

            {/* Word Match Progress */}
            <DetailedStatCard 
              title="Dopasowywanie Słów"
              icon={<Star className="w-5 h-5 text-yellow-400" />}
            >
              {wordMatchData?.length > 0 ? (
                <div className="space-y-4">
                  {wordMatchData.map((item: any, index: number) => (
                    <div 
                      key={`wordmatch-${index}-${item.difficulty}`}
                      className="bg-[var(--overlay-dark)] backdrop-blur-sm rounded-xl p-4 border border-[color:var(--border-translucent)] transition-all duration-300 hover:bg-black/30"
                    >
                      <h4 className="font-bold text-[var(--foreground)] mb-2">
                        Poziom: {item.difficulty}
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-300 mb-3">
                        <span>Nauczone: {item.learned_ids?.length || 0}</span>
                        <span>Wynik: {item.score}</span>
                        <span>Błędy: {item.errors}</span>
                        <span>Czas: {Math.round(item.time_spent / 60)} min</span>
                        <span className="col-span-2">Dokładność: {(item.score + item.errors) > 0 ? Math.round((item.score / (item.score + item.errors)) * 100) : 0}%</span>
                      </div>
                      <div className="bg-gray-800/50 backdrop-blur-sm rounded-full h-2 overflow-hidden border border-[color:var(--border-translucent)]">
                        <div 
                          className="bg-gradient-to-r from-[var(--progress-gradient-from)] via-[var(--progress-gradient-via)] to-[var(--progress-gradient-to)] h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{ 
                            width: `${(item.score + item.errors) > 0 ? Math.round((item.score / (item.score + item.errors)) * 100) : 0}%` 
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">Brak danych o dopasowywaniu</p>
              )}
            </DetailedStatCard>
          </div>
        </div>
      </div>
    </>
  );
}

// Enhanced Stat Card Component
function StatCard({ title, icon, children, bgColor }: { 
  title: string; 
  icon: React.ReactNode; 
  children: React.ReactNode;
  bgColor?: string;
}) {
  return (
    <div className={`bg-[var(--overlay-light)] backdrop-blur-lg rounded-xl shadow-2xl border border-[color:var(--border-translucent-strong)] p-6 transition-all duration-300 transform hover:scale-[1.02] hover:bg-[var(--overlay-light-soft)] h-full ${bgColor || ''}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-12 h-12 backdrop-blur-sm rounded-xl border border-[color:var(--border-translucent-strong)] group-hover:scale-110 transition-transform bg-gradient-to-br from-white/10 to-[var(--overlay-light-faint)]">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-[var(--foreground)]">{title}</h3>
      </div>
      {children}
    </div>
  );
}

// Mini Stat Card for Profile Section
function StatMiniCard({ icon, value, label, bgColor }: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  bgColor: string;
}) {
  return (
    <div className="text-center group cursor-pointer">
      <div className={`flex items-center justify-center w-14 h-14 backdrop-blur-sm rounded-xl mb-2 group-hover:scale-110 transition-transform ${bgColor}`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-[var(--foreground)]">{value}</div>
      <div className="text-xs text-gray-400">{label}</div>
    </div>
  );
}

// Detailed Stat Card Component
function DetailedStatCard({ title, icon, children }: { 
  title: string; 
  icon: React.ReactNode; 
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[var(--overlay-light)] backdrop-blur-lg rounded-xl shadow-2xl border border-[color:var(--border-translucent-strong)] p-6 transition-all duration-300 transform hover:scale-[1.02] hover:bg-[var(--overlay-light-soft)]">
      <h3 className="text-lg font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
        {icon}
        {title}
      </h3>
      {children}
    </div>
  );
}

// Progress Item Component
function ProgressItem({ label, value, color }: { 
  label: string; 
  value: string | number; 
  color?: string;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-300">{label}</span>
      <span className={`font-bold ${color || 'text-[var(--foreground)]'}`}>{value}</span>
    </div>
  );
}