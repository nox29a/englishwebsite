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
  const [answerEvents, setAnswerEvents] = useState<any[]>([]);
  const [skillSnapshots, setSkillSnapshots] = useState<any[]>([]);
  const [mistakes, setMistakes] = useState<any[]>([]);
  const [xpHistory, setXpHistory] = useState<any[]>([]);
  const [remediationActions, setRemediationActions] = useState<any[]>([]);
  const [earlyWarnings, setEarlyWarnings] = useState<any[]>([]);

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
            { data: streakInfo },
            { data: answerEventsData },
            { data: skillSnapshotData },
            { data: mistakesData },
            { data: xpHistoryData },
            { data: remediationData },
            { data: earlyWarningsData }
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
            supabase.from("streaks").select("*").eq("user_id", user.id).maybeSingle(),
            supabase
              .from("answer_events")
              .select("id, created_at, is_correct, skill_tag, latency_ms, question_identifier, prompt, expected_answer, user_answer")
              .eq("user_id", user.id)
              .order("created_at", { ascending: false })
              .limit(200),
            supabase
              .from("skill_snapshots")
              .select("id, skill_tag, current_mastery, best_mastery, xp_accumulated, updated_at, metadata")
              .eq("user_id", user.id)
              .order("updated_at", { ascending: false })
              .limit(200),
            supabase
              .from("mistakes")
              .select("id, taxonomy_id, created_at, severity, note, error_taxonomy:taxonomy_id(id, code, name, category), answer_event_id")
              .eq("user_id", user.id)
              .order("created_at", { ascending: false })
              .limit(100),
            supabase
              .from("xp_history")
              .select("id, amount, source, occurred_at, metadata")
              .eq("user_id", user.id)
              .order("occurred_at", { ascending: true })
              .limit(200),
            supabase
              .from("remediation_actions")
              .select("id, taxonomy_id, title, description, resource_url")
              .limit(100),
            supabase
              .from("early_warning_flags")
              .select("id, created_at, reason, metadata")
              .eq("user_id", user.id)
              .order("created_at", { ascending: false })
              .limit(20)
          ]);

          setUserData(profile);
          setAnswerEvents(answerEventsData ?? []);
          setSkillSnapshots(skillSnapshotData ?? []);
          setMistakes(mistakesData ?? []);
          setXpHistory(xpHistoryData ?? []);
          setRemediationActions(remediationData ?? []);
          setEarlyWarnings(earlyWarningsData ?? []);

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
      <div className="min-h-screen bg-gradient-to-br from-[#030712] via-[#050b1f] to-black flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(29,78,216,0.18),rgba(15,23,42,0))]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(29,78,216,0.15),rgba(3,7,18,0))]"></div>

        <div className="relative z-10 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 px-10 py-8 text-center shadow-[0_20px_45px_rgba(15,23,42,0.45)]">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#1D4ED8] to-[#1E3A8A] rounded-2xl mb-4 shadow-[0_10px_30px_rgba(29,78,216,0.35)]">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#E2E8F0] border-t-transparent"></div>
          </div>
          <h2 className="text-2xl font-semibold text-slate-100">Ładowanie danych...</h2>
          <p className="text-slate-400 mt-2">Przygotowujemy Twój spersonalizowany dashboard</p>
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

  const totalAnswersLogged = answerEvents.length;
  const totalCorrectAnswers = answerEvents.filter(event => event.is_correct).length;
  const accuracyRate = totalAnswersLogged > 0 ? Math.round((totalCorrectAnswers / totalAnswersLogged) * 100) : 0;
  const averageLatencySeconds = totalAnswersLogged > 0
    ? Math.round(
        answerEvents.reduce((acc, event) => acc + (event.latency_ms ?? 0), 0) /
          Math.max(1, totalAnswersLogged) /
          1000
      )
    : 0;

  const accuracyBySkill = Object.values(
    answerEvents.reduce((acc: Record<string, { name: string; correct: number; total: number }>, event) => {
      const skill = event.skill_tag ?? 'inne';
      if (!acc[skill]) {
        acc[skill] = { name: skill, correct: 0, total: 0 };
      }
      acc[skill].total += 1;
      if (event.is_correct) {
        acc[skill].correct += 1;
      }
      return acc;
    }, {})
  ).map((bucket) => ({
    name: bucket.name,
    value: bucket.total > 0 ? Math.round((bucket.correct / bucket.total) * 100) : 0,
  }));

  const latencyBySkill = Object.values(
    answerEvents.reduce((acc: Record<string, { name: string; totalLatency: number; count: number }>, event) => {
      const skill = event.skill_tag ?? 'inne';
      if (!acc[skill]) {
        acc[skill] = { name: skill, totalLatency: 0, count: 0 };
      }
      acc[skill].totalLatency += event.latency_ms ?? 0;
      acc[skill].count += 1;
      return acc;
    }, {})
  ).map((bucket) => ({
    name: bucket.name,
    value: bucket.count > 0 ? Math.round((bucket.totalLatency / bucket.count) / 1000) : 0,
  }));

  const xpTimelineData = (xpHistory ?? []).reduce<{ name: string; value: number }[]>((acc, entry) => {
    const lastValue = acc.length > 0 ? acc[acc.length - 1].value : 0;
    const amount = entry.amount ?? 0;
    acc.push({
      name: new Date(entry.occurred_at).toLocaleDateString('pl-PL'),
      value: lastValue + amount,
    });
    return acc;
  }, []);

  const mistakesByCategory = Object.values(
    mistakes.reduce((acc: Record<string, { name: string; value: number }>, mistake) => {
      const category = mistake.error_taxonomy?.category ?? 'inne';
      if (!acc[category]) {
        acc[category] = { name: category, value: 0 };
      }
      acc[category].value += 1;
      return acc;
    }, {})
  );

  const relevantTaxonomyIds = new Set(
    mistakes
      .map((mistake) => mistake.taxonomy_id)
      .filter((id: string | null | undefined): id is string => Boolean(id))
  );

  const relevantRemediations = (remediationActions ?? []).filter((action) =>
    action.taxonomy_id ? relevantTaxonomyIds.has(action.taxonomy_id) : false
  );

  const recentAnswerEvents = answerEvents.slice(0, 8);
  const recentWarnings = earlyWarnings ?? [];
  const snapshotsToShow = skillSnapshots.slice(0, 6);
  const lastXpEntry = xpHistory.length > 0 ? xpHistory[xpHistory.length - 1] : null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#030712] via-[#050b1f] to-black p-4 md:p-10 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(29,78,216,0.18),rgba(15,23,42,0))]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(29,78,216,0.15),rgba(3,7,18,0))]"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header with streak */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-semibold text-slate-100 tracking-wide mb-3">Twój Dashboard</h1>
              <p className="text-slate-400 text-lg max-w-2xl">
                Śledź swój postęp w nauce i odkrywaj kolejne kroki, które przybliżą Cię do biegłości w języku.
              </p>
              {streak > 0 && (
                <div className="inline-flex items-center bg-[#1D4ED8]/20 backdrop-blur-md px-4 py-2 rounded-full border border-[#1D4ED8]/30 mt-4">
                  <Flame className="w-5 h-5 text-[#E2E8F0] mr-2" />
                  <span className="text-slate-100 font-semibold tracking-wide">Streak: {streak} dni</span>
                </div>
              )}
            </div>

            <nav className="flex flex-wrap gap-3">
              <Link
                href="/"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#1D4ED8] to-[#1E3A8A] text-slate-100 font-medium tracking-wide shadow-[0_10px_30px_rgba(29,78,216,0.35)] transition-all duration-300 hover:from-[#1E40AF] hover:to-[#172554] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/50"
              >
                <BookOpen className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                Kontynuuj naukę
              </Link>
              <Link
                href="/settings"
                className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 backdrop-blur-md transition-all duration-300 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/40"
              >
                Ustawienia
              </Link>
              <button
                onClick={handleLogout}
                className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 backdrop-blur-md transition-all duration-300 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#ef4444]/40"
              >
                Wyloguj
              </button>
            </nav>
          </div>

          {/* User Profile Card */}
          {userData && (
            <div className="mb-10 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 transition-all duration-300 hover:bg-white/10">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1D4ED8]/80 to-[#1E3A8A]/80 flex items-center justify-center text-3xl font-semibold text-slate-100 shadow-lg">
                    {userData.first_name?.[0]}{userData.last_name?.[0]}
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-[#1D4ED8]/30 rounded-full flex items-center justify-center border border-white/10">
                    <Sparkles className="w-3.5 h-3.5 text-[#E2E8F0]" />
                  </div>
                </div>

                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-slate-100 mb-1">
                    {userData.first_name} {userData.last_name}
                  </h2>
                  <p className="text-slate-400 text-lg">{userData.email}</p>
                  {combinedProgress && (
                    <p className="mt-2 text-slate-400">
                      Dołączyłeś {new Date(userData.created_at).toLocaleDateString("pl-PL")} • Całkowity czas nauki: {Math.round((combinedProgress.time_spent || 0) / 60)} minut
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatMiniCard
                    icon={<Target className="w-5 h-5 text-[#E2E8F0]" />}
                    value={combinedProgress?.correct_answers || 0}
                    label="Poprawne"
                  />
                  <StatMiniCard
                    icon={<BarChart3 className="w-5 h-5 text-[#E2E8F0]" />}
                    value={combinedProgress?.total_answers || 0}
                    label="Odpowiedzi"
                  />
                  <StatMiniCard
                    icon={<TrendingUp className="w-5 h-5 text-[#E2E8F0]" />}
                    value={`${combinedProgress?.total_answers > 0
                      ? Math.round((combinedProgress.correct_answers / combinedProgress.total_answers) * 100)
                      : 0}%`}
                    label="Skuteczność"
                  />
                  <StatMiniCard
                    icon={<CheckCircle className="w-5 h-5 text-[#E2E8F0]" />}
                    value={combinedProgress?.completed_tasks || 0}
                    label="Ukończone"
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {/* Overall Progress */}
            <StatCard
              title="Ogólny Postęp"
              icon={<Trophy className="w-6 h-6 text-[#E2E8F0]" />}
            >
              {combinedProgress ? (
                <div className="space-y-3">
                  <ProgressItem
                    label="Poprawne odpowiedzi"
                    value={combinedProgress.correct_answers}
                  />
                  <ProgressItem
                    label="Łączne odpowiedzi"
                    value={combinedProgress.total_answers}
                  />
                  <ProgressItem
                    label="Dokładność"
                    value={`${combinedProgress.total_answers > 0
                      ? Math.round((combinedProgress.correct_answers / combinedProgress.total_answers) * 100)
                      : 0}%`}
                  />
                  <ProgressItem
                    label="Czas nauki"
                    value={`${Math.round((combinedProgress.time_spent || 0) / 60)} minut`}
                  />
                  <ProgressItem
                    label="Ukończone zadania"
                    value={combinedProgress.completed_tasks || 0}
                  />
                </div>
              ) : (
                <p className="text-slate-400">Brak danych</p>
              )}
            </StatCard>

            {/* Irregular Verbs Progress */}
            <StatCard
              title="Czasowniki Nieregularne"
              icon={<Zap className="w-6 h-6 text-[#E2E8F0]" />}
            >
              {irregularProgressData?.length > 0 ? (
                <div className="space-y-4">
                  {irregularProgressData.map((item: any, index: number) => (
                    <div key={`irregular_progress-${index}`} className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                      <h4 className="font-semibold text-slate-100 mb-2">
                        Postęp czasowników
                      </h4>
                      <div className="flex justify-between text-sm text-slate-400 mb-2">
                        <span>Poprawne: {item.correct_answers}/{item.total_answers}</span>
                        <span>Pozostało: {item.remaining_verbs ? item.remaining_verbs.length : 0}</span>
                      </div>
                      <div className="bg-white/5 backdrop-blur-sm rounded-full h-3 overflow-hidden border border-white/10">
                        <div
                          className="bg-gradient-to-r from-[#1D4ED8] to-[#1E3A8A] h-3 rounded-full transition-all duration-1000 ease-out relative"
                          style={{
                            width: `${item.total_answers > 0 ? Math.round((item.correct_answers / item.total_answers) * 100) : 0}%`
                          }}
                        >
                          <div className="absolute inset-0 bg-[#1D4ED8]/20 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400">Brak danych o czasownikach</p>
              )}
            </StatCard>

            {/* Grammar Tasks Progress */}
            <StatCard
              title="Zadania Gramatyczne"
              icon={<BookOpen className="w-6 h-6 text-[#E2E8F0]" />}
            >
              {tasksProgressData ? (
                <div className="space-y-4">
                  <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                    <h4 className="font-semibold text-slate-100 mb-2">
                      Ogólny postęp zadań
                    </h4>
                    <div className="flex justify-between text-sm text-slate-400 mb-2">
                      <span>Poprawne: {tasksProgressData.correct_answers}/320</span>
                      <span>Ukończone: {combinedProgress?.completed_tasks || 0}</span>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-full h-3 overflow-hidden border border-white/10">
                      <div
                        className="bg-gradient-to-r from-[#1D4ED8] to-[#1E3A8A] h-3 rounded-full transition-all duration-1000 ease-out relative"
                        style={{
                          width: `${tasksProgressData.total_attempts > 0 ? Math.round((tasksProgressData.correct_answers / 320) * 100) : 0}%`
                        }}
                      >
                        <div className="absolute inset-0 bg-[#1D4ED8]/20 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-slate-400">Brak danych o zadaniach</p>
              )}
            </StatCard>

            {/* Time Stats */}
            <StatCard 
              title="Statystyki Czasu"
              icon={<Clock className="w-6 h-6 text-[#E2E8F0]" />}
            >
              <div className="space-y-3">
                <ProgressItem
                  label="Czas dzisiaj"
                  value={`${timeData.length > 0 && timeData[0].dateObj.toDateString() === new Date().toDateString() ? timeData[0].time : 0} min`}
                />
                <ProgressItem
                  label="Średnio dziennie"
                  value={`${timeData.length > 0 ? Math.round(timeData.reduce((sum, item) => sum + item.time, 0) / timeData.length) : 0} min`}
                />
                <ProgressItem
                  label="Dni aktywnych"
                  value={timeData.length}
                />
                <ProgressItem
                  label="Łączny czas"
                  value={`${Math.round((combinedProgress?.time_spent || 0) / 60)} min`}
                />
              </div>
            </StatCard>
          </div>

          {/* Detailed Progress Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Flashcards Progress */}
            <DetailedStatCard
              title="Postępy w fiszkach"
              icon={<Brain className="w-5 h-5 text-[#E2E8F0]" />}
            >
              {flashcardsData?.length > 0 ? (
                <div className="space-y-4">
                  {flashcardsData.map((item: any, index: number) => (
                    <div
                      key={`flashcard-${index}-${item.level}-${item.direction}`}
                      className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 transition-all duration-300 hover:bg-white/10"
                    >
                      <h4 className="font-semibold text-slate-100 mb-2">
                        {item.level} ({item.direction})
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm text-slate-300 mb-3">
                        <span>Pozostało: {item.remaining_ids?.length || 0}</span>
                        <span>Poprawne: {item.correct_answers}/{item.total_answers}</span>
                        <span>Dokładność: {item.total_answers > 0 ? Math.round((item.correct_answers / item.total_answers) * 100) : 0}%</span>
                        <span>Czas: {Math.round((item.time_spend || 0) / 60)} min</span>
                      </div>
                      <div className="bg-white/5 backdrop-blur-sm rounded-full h-2 overflow-hidden border border-white/10">
                        <div
                          className="bg-gradient-to-r from-[#1D4ED8] to-[#1E3A8A] h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: `${item.total_answers > 0 ? Math.round((item.correct_answers / item.total_answers) * 100) : 0}%`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400">Brak danych o fiszkach</p>
              )}
            </DetailedStatCard>

            {/* Word Match Progress */}
            <DetailedStatCard
              title="Dopasowywanie Słów"
              icon={<Star className="w-5 h-5 text-[#E2E8F0]" />}
            >
              {wordMatchData?.length > 0 ? (
                <div className="space-y-4">
                  {wordMatchData.map((item: any, index: number) => (
                    <div
                      key={`wordmatch-${index}-${item.difficulty}`}
                      className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 transition-all duration-300 hover:bg-white/10"
                    >
                      <h4 className="font-semibold text-slate-100 mb-2">
                        Poziom: {item.difficulty}
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm text-slate-300 mb-3">
                        <span>Nauczone: {item.learned_ids?.length || 0}</span>
                        <span>Wynik: {item.score}</span>
                        <span>Błędy: {item.errors}</span>
                        <span>Czas: {Math.round(item.time_spent / 60)} min</span>
                        <span className="col-span-2">Dokładność: {(item.score + item.errors) > 0 ? Math.round((item.score / (item.score + item.errors)) * 100) : 0}%</span>
                      </div>
                      <div className="bg-white/5 backdrop-blur-sm rounded-full h-2 overflow-hidden border border-white/10">
                        <div
                          className="bg-gradient-to-r from-[#1D4ED8] to-[#1E3A8A] h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: `${(item.score + item.errors) > 0 ? Math.round((item.score / (item.score + item.errors)) * 100) : 0}%`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400">Brak danych o dopasowywaniu</p>
              )}
            </DetailedStatCard>
          </div>

          {/* Advanced analytics from Supabase */}
          <div className="mt-10 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-[var(--foreground)]">Zaawansowane statystyki Supabase</h2>
              <p className="text-gray-300">Kompleksowy podgląd wszystkich wydarzeń zapisanych w bazie danych.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <StatCard
                title="Łączna skuteczność"
                icon={<TrendingUp className="w-6 h-6 text-green-400" />}
                bgColor="bg-gradient-to-br from-green-400/20 to-green-600/20 border border-green-500/30"
              >
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-[var(--foreground)]">{accuracyRate}%</p>
                  <p className="text-gray-300">Na podstawie {totalAnswersLogged} odpowiedzi zapisanych w Supabase.</p>
                </div>
              </StatCard>
              <StatCard
                title="Średni czas reakcji"
                icon={<Clock className="w-6 h-6 text-blue-400" />}
                bgColor="bg-gradient-to-br from-blue-400/20 to-blue-600/20 border border-blue-500/30"
              >
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-[var(--foreground)]">{averageLatencySeconds}s</p>
                  <p className="text-gray-300">Uśredniona latencja wszystkich wydarzeń odpowiedzi.</p>
                </div>
              </StatCard>
              <StatCard
                title="Ostatnie punkty XP"
                icon={<Zap className="w-6 h-6 text-amber-400" />}
                bgColor="bg-gradient-to-br from-amber-400/20 to-amber-600/20 border border-amber-500/30"
              >
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-[var(--foreground)]">{lastXpEntry?.amount ?? 0} XP</p>
                  <p className="text-gray-300">Źródło: {lastXpEntry?.source ?? 'brak danych'}.</p>
                </div>
              </StatCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DetailedStatCard
                title="Skuteczność według umiejętności"
                icon={<BarChart3 className="w-5 h-5 text-purple-400" />}
              >
                {accuracyBySkill.length > 0 ? (
                  <ChartContainer data={accuracyBySkill} type="bar" />
                ) : (
                  <p className="text-gray-400">Brak zapisanych odpowiedzi do analizy.</p>
                )}
              </DetailedStatCard>
              <DetailedStatCard
                title="Tempo odpowiedzi"
                icon={<Clock className="w-5 h-5 text-blue-400" />}
              >
                {latencyBySkill.length > 0 ? (
                  <ChartContainer data={latencyBySkill} type="line" />
                ) : (
                  <p className="text-gray-400">Brak danych o czasie odpowiedzi.</p>
                )}
              </DetailedStatCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DetailedStatCard
                title="Historia zdobywania XP"
                icon={<Zap className="w-5 h-5 text-amber-400" />}
              >
                {xpTimelineData.length > 0 ? (
                  <ChartContainer data={xpTimelineData} type="line" />
                ) : (
                  <p className="text-gray-400">Brak historii punktów do wyświetlenia.</p>
                )}
              </DetailedStatCard>
              <DetailedStatCard
                title="Najczęstsze kategorie błędów"
                icon={<Target className="w-5 h-5 text-red-400" />}
              >
                {mistakesByCategory.length > 0 ? (
                  <ChartContainer data={mistakesByCategory} type="pie" />
                ) : (
                  <p className="text-gray-400">Brak danych o błędach.</p>
                )}
              </DetailedStatCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <DetailedStatCard
                title="Poziomy umiejętności"
                icon={<Brain className="w-5 h-5 text-indigo-400" />}
              >
                {snapshotsToShow.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3">
                    {snapshotsToShow.map((snapshot: any) => (
                      <div
                        key={`${snapshot.id}-${snapshot.skill_tag}`}
                        className="bg-[var(--overlay-dark)] backdrop-blur-sm rounded-xl p-4 border border-[color:var(--border-translucent)]"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-[var(--foreground)]">{snapshot.skill_tag}</h4>
                          <span className="text-sm text-gray-400">{new Date(snapshot.updated_at).toLocaleDateString('pl-PL')}</span>
                        </div>
                        <p className="text-gray-300 mt-2">Aktualna biegłość: {Math.round(snapshot.current_mastery ?? 0)}%</p>
                        <p className="text-gray-400 text-sm">Najlepszy wynik: {Math.round(snapshot.best_mastery ?? 0)}%</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">Brak zarejestrowanych pomiarów umiejętności.</p>
                )}
              </DetailedStatCard>

              <DetailedStatCard
                title="Ostatnie odpowiedzi"
                icon={<Clock className="w-5 h-5 text-emerald-400" />}
              >
                {recentAnswerEvents.length > 0 ? (
                  <div className="space-y-3">
                    {recentAnswerEvents.map((event) => (
                      <div
                        key={event.id}
                        className="bg-[var(--overlay-dark)] backdrop-blur-sm rounded-xl p-3 border border-[color:var(--border-translucent)]"
                      >
                        <div className="flex items-center justify-between text-sm">
                          <span className={`font-semibold ${event.is_correct ? 'text-green-400' : 'text-red-400'}`}>
                            {event.is_correct ? 'Poprawna' : 'Błędna'} odpowiedź
                          </span>
                          <span className="text-gray-400">{new Date(event.created_at).toLocaleTimeString('pl-PL')}</span>
                        </div>
                        <p className="text-gray-300 text-sm mt-1">Umiejętność: {event.skill_tag ?? 'ogólne'}</p>
                        {event.question_identifier && (
                          <p className="text-gray-400 text-xs">Id: {event.question_identifier}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">Brak zapisanych odpowiedzi.</p>
                )}
              </DetailedStatCard>

              <DetailedStatCard
                title="Alerty i rekomendacje"
                icon={<Award className="w-5 h-5 text-amber-400" />}
              >
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-[var(--foreground)] mb-2">Rekomendacje</h4>
                    {relevantRemediations.length > 0 ? (
                      <ul className="space-y-2 text-sm text-gray-300">
                        {relevantRemediations.slice(0, 4).map((action) => (
                          <li key={action.id} className="bg-[var(--overlay-dark)] p-3 rounded-lg border border-[color:var(--border-translucent)]">
                            <p className="font-semibold text-[var(--foreground)]">{action.title}</p>
                            <p className="text-xs text-gray-400 mt-1">{action.description}</p>
                            {action.resource_url && (
                              <a
                                href={action.resource_url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-blue-400 hover:underline"
                              >
                                Materiał dodatkowy
                              </a>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400 text-sm">Brak dedykowanych rekomendacji.</p>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-[var(--foreground)] mb-2">Ostrzeżenia</h4>
                    {recentWarnings.length > 0 ? (
                      <ul className="space-y-2 text-sm text-gray-300">
                        {recentWarnings.slice(0, 4).map((warning: any) => (
                          <li key={warning.id} className="bg-[var(--overlay-dark)] p-3 rounded-lg border border-[color:var(--border-translucent)]">
                            <p className="font-semibold text-red-300">{warning.reason}</p>
                            <p className="text-xs text-gray-400 mt-1">{new Date(warning.created_at).toLocaleString('pl-PL')}</p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400 text-sm">Brak aktywnych ostrzeżeń.</p>
                    )}
                  </div>
                </div>
              </DetailedStatCard>
            </div>
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
    <div
      className={`rounded-3xl p-6 backdrop-blur-xl transition-transform duration-300 hover:scale-[1.02] hover:bg-white/10 h-full shadow-[0_20px_45px_rgba(15,23,42,0.35)] ${
        bgColor || 'bg-white/5 border border-white/10'
      }`}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl border border-white/10 bg-[#1D4ED8]/15">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-slate-100 tracking-wide">{title}</h3>
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
  bgColor?: string;
}) {
  return (
    <div className="text-center group cursor-pointer">
      <div className={`flex items-center justify-center w-14 h-14 rounded-2xl mb-2 bg-[#1D4ED8]/15 border border-white/10 group-hover:scale-105 transition-transform ${bgColor || ''}`}>
        {icon}
      </div>
      <div className="text-2xl font-semibold text-slate-100">{value}</div>
      <div className="text-xs text-slate-400 uppercase tracking-wide">{label}</div>
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
    <div className="rounded-3xl p-6 backdrop-blur-xl transition-transform duration-300 hover:scale-[1.02] hover:bg-white/10 shadow-[0_20px_45px_rgba(15,23,42,0.35)] bg-white/5 border border-white/10">
      <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2 tracking-wide">
        {icon}
        {title}
      </h3>
      {children}
    </div>
  );
}

// Progress Item Component
function ProgressItem({ label, value }: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-slate-400">{label}</span>
      <span className="text-slate-100 font-semibold">{value}</span>
    </div>
  );
}
