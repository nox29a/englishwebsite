"use client"
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from "@/lib/supabaseClient";
import { isAuthSessionMissingError } from "@/lib/authErrorUtils";
import { LANGUAGE_OPTIONS } from "@/components/words/language_packs";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userType, setUserType] = useState<string>("basic");
  const [userPoints, setUserPoints] = useState<number>(0);
  const [userStreak, setUserStreak] = useState<number>(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const { language, setLanguage } = useLanguage();
  const pathname = usePathname();
  const userId = user?.id ?? null;

  const currentLanguageOption = useMemo(
    () => LANGUAGE_OPTIONS.find(option => option.code === language),
    [language]
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        if (!isAuthSessionMissingError(error)) {
          console.error("Nie udało się pobrać danych użytkownika:", error);
        }
        return;
      }

      if (data?.user) {
        setUser(data.user);
        
        // Pobierz profil użytkownika
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', data.user.id)
          .single();
          
        if (profileData && !profileError) {
          setUserType(profileData.user_type);
        }

        // Pobierz punkty użytkownika z widoku XP
        const { data: leaderboardData, error: leaderboardError } = await supabase
          .from('view_xp_leaderboard')
          .select('total_xp')
          .eq('user_id', data.user.id)
          .maybeSingle();

        if (!leaderboardError && leaderboardData) {
          setUserPoints(leaderboardData.total_xp ?? 0);
        } else {
          setUserPoints(0);
        }

        // Pobierz aktualny streak
        const { data: streakData, error: streakError } = await supabase
          .from('streaks')
          .select('current_streak')
          .eq('user_id', data.user.id)
          .maybeSingle();

        if (!streakError && streakData) {
          setUserStreak(streakData.current_streak ?? 0);
        } else {
          setUserStreak(0);
        }
      }
    };

    getUser();
  }, []);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const xpChannel = supabase
      .channel(`xp-updates-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'xp_history',
          filter: `user_id=eq.${userId}`,
        },
        async () => {
          const { data: leaderboardData, error: leaderboardError } = await supabase
            .from('view_xp_leaderboard')
            .select('total_xp')
            .eq('user_id', userId)
            .maybeSingle();

          if (!leaderboardError && leaderboardData) {
            setUserPoints(leaderboardData.total_xp ?? 0);
          } else if (!leaderboardError && !leaderboardData) {
            setUserPoints(0);
          }
        }
      );

    const streakChannel = supabase
      .channel(`streak-updates-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'streaks',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === 'DELETE') {
            setUserStreak(0);
            return;
          }

          const newRow = payload.new as { current_streak?: number } | null;

          if (typeof newRow?.current_streak === 'number') {
            setUserStreak(newRow.current_streak);
          }
        }
      );

    void xpChannel.subscribe();
    void streakChannel.subscribe();

    return () => {
      supabase.removeChannel(xpChannel);
      supabase.removeChannel(streakChannel);
    };
  }, [userId]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleXpUpdate = (event: Event) => {
      const detail = (event as CustomEvent<{ delta?: number; total?: number }>).detail;

      if (!detail) {
        return;
      }

      const { total, delta } = detail;

      if (typeof total === "number") {
        setUserPoints(total);
        return;
      }

      if (typeof delta === "number") {
        setUserPoints((prev) => Math.max(prev + delta, 0));
      }
    };

    window.addEventListener("xp-updated", handleXpUpdate as EventListener);

    return () => {
      window.removeEventListener("xp-updated", handleXpUpdate as EventListener);
    };
  }, []);

  const navLinks = useMemo(() => [
    {
      href: "/cards",
      label: "Fiszki"
    },
    {
      href: "/flashcards",
      label: "Nauka słówek"
    },
    {
      href: "/youtube-kategorie",
      label: "Kategorie z YouTube"
    },
    {
      href: "/vocabulary",
      label: "Dopasowanie słówek"
    },
    {
      href: "/conversation",
      label: "Rozmowa"
    },
    {
      href: "/exercises",
      label: "Zadania gramatyczne"
    },
    {
      href: "/irregular-verbs",
      label: "Czasowniki nieregularne"
    },
  ], []);

  const baseLevelXp = 250;

  // Funkcja pomocnicza do obliczania całkowitej liczby punktów
  // wymaganych do osiągnięcia danego poziomu.
  const getTotalXpForLevel = (level: number) => {
    if (level <= 1) {
      return 0;
    }

    return (baseLevelXp * (level - 1) * level) / 2;
  };

  // Funkcja do obliczania poziomu na podstawie punktów
  const calculateLevel = (points: number) => {
    let level = 1;

    while (points >= getTotalXpForLevel(level + 1)) {
      level += 1;
    }

    return level;
  };

  // Funkcja do obliczania postępu do następnego poziomu
  const calculateProgress = (points: number) => {
    const currentLevel = calculateLevel(points);
    const currentLevelXp = getTotalXpForLevel(currentLevel);
    const nextLevelXp = getTotalXpForLevel(currentLevel + 1);
    const xpIntoCurrentLevel = points - currentLevelXp;
    const xpForLevel = nextLevelXp - currentLevelXp || baseLevelXp;
    const pointsToNext = Math.max(nextLevelXp - points, 0);
    const progressPercent = Math.min((xpIntoCurrentLevel / xpForLevel) * 100, 100);

    return { currentLevelPoints: xpIntoCurrentLevel, pointsToNext, progressPercent };
  };

  const currentLevel = calculateLevel(userPoints);
  const progress = calculateProgress(userPoints);

  return (
    <>
      <nav
        className={`sticky top-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-black/70 backdrop-blur-2xl border-b border-white/10 shadow-[0_20px_60px_rgba(2,6,23,0.45)]'
            : 'bg-gradient-to-br from-[#030712]/95 via-[#05143A]/95 to-black/90 border-b border-white/5 shadow-[0_10px_40px_rgba(15,23,42,0.55)]'
        }`}
        aria-label="Główna nawigacja"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 relative">
          {/* Animated background overlay */}
          <div className="pointer-events-none absolute -inset-6 bg-gradient-to-r from-[#1D4ED8]/10 via-[#1E3A8A]/5 to-transparent opacity-80 blur-2xl" />
          <div className="pointer-events-none absolute -top-24 -right-10 w-72 h-72 bg-[#1D4ED8]/20 rounded-full blur-3xl" aria-hidden="true" />

          <div className="flex justify-between items-center relative z-10 gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="p-2 text-2xl font-semibold bg-gradient-to-r from-[#1D4ED8] to-[#1E3A8A] rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-[0_10px_30px_rgba(29,78,216,0.35)] text-slate-100">
                AxonAI
              </div>
              <div>
    
              </div>
            </Link>

            {/* Menu desktop */}
            <div className="hidden md:flex items-center space-x-2" role="menubar" aria-label="Główne obszary nauki">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    role="menuitem"
                    className={`group relative px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                      isActive
                        ? 'bg-white/10 text-slate-100 shadow-[0_10px_30px_rgba(29,78,216,0.25)]'
                        : 'text-slate-300 hover:text-slate-100 hover:bg-white/5 border border-transparent hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{link.label}</span>
                    </div>

                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-[#1D4ED8]/20 to-[#1E3A8A]/20 rounded-xl animate-pulse" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Language selector desktop */}
            <div className="hidden md:flex flex-col items-center gap-3">
              <div className="leading-tight text-right">
                <span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-300/80">
                  Wybierz język nauki
                </span>

              </div>
              <div className="flex items-center gap-3">
                {LANGUAGE_OPTIONS.map(option => {
                  const isActive = option.code === language;

                  return (
                    <button
                      key={option.code}
                      type="button"
                      onClick={() => setLanguage(option.code)}
                      className={`relative flex h-12 w-12 items-center justify-center rounded-2xl border transition-all duration-300 backdrop-blur-sm ${
                        isActive
                          ? 'border-white/40 bg-white/10 shadow-[0_8px_24px_rgba(29,78,216,0.35)]'
                          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                      }`}
                      aria-label={`Ucz się: ${option.label}`}
                      aria-pressed={isActive}
                      title={option.label}
                    >
                      <span className="text-2xl" role="img" aria-hidden="true">
                        {option.flag}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* User section desktop */}
            <div className="hidden md:flex items-center gap-3">
              {user && (
                <>
                  {/* User stats preview */}
                  <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-3 py-2 rounded-full border border-white/10">
                    <span className="text-sm font-bold text-slate-100">Lvl {currentLevel}</span>
                    <div className="w-px h-4 bg-white/10" />
                    <span className="text-sm font-semibold text-slate-300">{userPoints} XP</span>
                    <div className="w-px h-4 bg-white/10" />
                    <span className="text-sm font-semibold text-slate-300 flex items-center gap-1">
                      <span aria-hidden="true">🔥</span>
                      <span className="sr-only">Streak:</span>
                      <span>{userStreak} dni</span>
                    </span>
                  </div>

                  {/* Account button */}
                  <Link
                    href="/dashboard"
                    className={`group relative px-6 py-3 rounded-xl font-semibold text-slate-100 transition-all duration-300 shadow-[0_10px_30px_rgba(29,78,216,0.35)] hover:shadow-[0_14px_40px_rgba(29,78,216,0.45)] transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]/50 ${
                      userType === "premium"
                        ? 'bg-gradient-to-r from-[#FACC15] to-[#F97316] border border-yellow-300/50'
                        : 'bg-gradient-to-r from-[#1D4ED8] to-[#1E3A8A]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>Konto</span>
                    </div>

                    {userType === "premium" && (
                      <div className="absolute inset-0 bg-white/10 rounded-xl animate-pulse" />
                    )}
                  </Link>
                </>
              )}

              {/* Login button for non-authenticated users */}
              {!user && (
                <Link
                  href="/login"
                  className="group px-6 py-3 bg-gradient-to-r from-[#1D4ED8] to-[#1E3A8A] hover:from-[#1E40AF] hover:to-[#172554] rounded-xl text-slate-100 font-semibold transition-all duration-300 shadow-[0_10px_30px_rgba(29,78,216,0.35)] hover:shadow-[0_14px_40px_rgba(29,78,216,0.45)] transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]/50"
                >
                  <div className="flex items-center gap-2">
                    <span>Zaloguj się</span>
                  </div>
                </Link>
              )}
            </div>

            {/* Hamburger mobile */}
            <button
              className="md:hidden w-12 h-12 bg-white/5 backdrop-blur-md hover:bg-white/10 text-slate-100 rounded-2xl transition-all duration-300 border border-white/10 transform hover:scale-110 flex items-center justify-center"
              onClick={() => setMobileOpen((open) => !open)}
              aria-label={mobileOpen ? "Zamknij menu" : "Otwórz menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              <span className="text-2xl font-bold" aria-hidden="true">
                {mobileOpen ? "×" : "≡"}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true" aria-label="Menu nawigacyjne">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[rgba(3,7,18,0.7)] backdrop-blur"
            onClick={() => setMobileOpen(false)}
          />

          {/* Menu panel */}
          <div
            id="mobile-menu"
            className="absolute top-0 right-0 w-80 max-w-[90vw] h-full bg-gradient-to-b from-[#030712]/98 via-[#05143A]/95 to-black/95 border-l border-white/10 shadow-[0_20px_60px_rgba(2,6,23,0.6)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#1D4ED8]/15 via-transparent to-[#1E3A8A]/10" />

            <div className="relative z-10 p-4 h-full flex flex-col overflow-y-auto">
              {/* Close button */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-10 h-10 bg-white/5 backdrop-blur-md hover:bg-white/10 text-slate-100 rounded-2xl transition-all duration-300 border border-white/10 transform hover:scale-110 flex items-center justify-center"
                  aria-label="Zamknij menu"
                >
                  <span className="text-xl font-bold" aria-hidden="true">
                    ×
                  </span>
                </button>
              </div>

              {/* User info mobile */}
              {user && (
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-3 border border-white/10 mb-4 shadow-[0_12px_30px_rgba(15,23,42,0.35)]">
                  <div className="flex items-center gap-3 mb-2.5">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                      userType === "premium"
                        ? 'bg-gradient-to-r from-[#FACC15] to-[#F97316]'
                        : 'bg-gradient-to-r from-[#1D4ED8] to-[#1E3A8A]'
                    }`}>
                      <div className="w-5 h-5 text-slate-100 font-bold">
                        {userType === "premium" ? "P" : "U"}
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-100">{userType === "premium" ? "Premium User" : "Basic User"}</div>
                      <div className="text-sm text-slate-300">Level {currentLevel} • {userPoints} XP • 🔥 {userStreak} dni</div>
                    </div>
                  </div>

                  {/* Mini progress bar */}
                  <div className="bg-white/10 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#1D4ED8] via-[#1E3A8A] to-[#0F172A] h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${progress.progressPercent}%` }}
                    />
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{progress.pointsToNext} XP do następnego poziomu</div>
                </div>
              )}

              {/* Language selector mobile */}
              <div className="mb-4">
                <div className="text-sm font-semibold uppercase tracking-wide text-slate-300/80">
                  Wybierz język
                </div>
                <div className="text-xs text-slate-400 mb-3">
                  Wybierz flagę języka, którego chcesz się uczyć
                </div>
                <div className="flex gap-2.5">
                  {LANGUAGE_OPTIONS.map(option => {
                    const isActive = option.code === language;

                    return (
                      <button
                        key={option.code}
                        type="button"
                        onClick={() => setLanguage(option.code)}
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl border text-2xl transition-all duration-300 ${
                          isActive
                            ? 'border-white/30 bg-white/10 shadow-[0_10px_24px_rgba(29,78,216,0.35)]'
                            : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                        }`}
                        aria-label={`Ucz się: ${option.label}`}
                        aria-pressed={isActive}
                        title={option.label}
                      >
                        <span role="img" aria-hidden="true">
                          {option.flag}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-2 text-xs text-slate-400">
                  Aktualny język: <span className="font-semibold text-slate-200">{currentLanguageOption?.label}</span>
                </div>
              </div>

              {/* Navigation links */}
              <div className="space-y-1.5 flex-1" role="menu" aria-label="Główne obszary nauki">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] ${
                        isActive
                          ? 'bg-white/10 text-slate-100 shadow-[0_12px_30px_rgba(29,78,216,0.35)]'
                          : 'text-slate-300 hover:text-slate-100 hover:bg-white/5 border border-transparent hover:border-white/10'
                      }`}
                      onClick={() => setMobileOpen(false)}
                      role="menuitem"
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        isActive
                          ? 'bg-[#1D4ED8]/20'
                          : 'bg-white/5 group-hover:bg-white/10'
                      }`}>
                        <div className="w-5 h-5 font-bold">
                          {link.label.charAt(0)}
                        </div>
                      </div>
                      <span className="font-medium">{link.label}</span>
                      
                      {isActive && (
                        <div className="ml-auto">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Action button mobile */}
              <div className="pt-4 border-t border-white/10">
                <Link
                  href={user ? "/dashboard" : "/login"}
                  className={`w-full flex items-center justify-center gap-3 p-3 rounded-2xl font-semibold text-slate-100 transition-all duration-300 shadow-[0_12px_30px_rgba(29,78,216,0.35)] transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]/40 ${
                    userType === "premium"
                      ? 'bg-gradient-to-r from-[#FACC15] to-[#F97316]'
                      : 'bg-gradient-to-r from-[#1D4ED8] to-[#1E3A8A] hover:from-[#1E40AF] hover:to-[#172554]'
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {user ? (
                    <>
                      <span>Przejdź do konta</span>
                    </>
                  ) : (
                    <>
                      <span>Zaloguj się</span>
                    </>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </>
  );
}